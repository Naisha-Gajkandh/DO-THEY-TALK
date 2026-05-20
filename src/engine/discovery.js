import DATASET_REGISTRY from '../data/registry';
import { MIN_DISPLAY_CORRELATION, scoreCorrelation } from './correlationModel';
import { getCached, setCache } from '../api/cache';
import PRECALCULATED_CORRELATIONS from '../data/precalculated';
import { isCorrelationAllowed } from '../data/contentFilter';

const seriesCache = new Map();
const inflightFetches = new Map();

const visibleDatasetIds = new Set(DATASET_REGISTRY.map(dataset => dataset.id));

function pairKey(aId, bId) {
  return [aId, bId].sort().join('__');
}

async function fetchSeries(dataset) {
  if (seriesCache.has(dataset.id)) {
    return seriesCache.get(dataset.id);
  }
  if (!inflightFetches.has(dataset.id)) {
    const promise = dataset.fetchFn().then(data => {
      seriesCache.set(dataset.id, data);
      inflightFetches.delete(dataset.id);
      return data;
    }).catch(err => {
      inflightFetches.delete(dataset.id);
      throw err;
    });
    inflightFetches.set(dataset.id, promise);
  }
  return inflightFetches.get(dataset.id);
}

/**
 * Checks if a dataset belongs to the requested category or its sub-labels.
 */
function isRelevantToCategory(dataset, category) {
  const allowed = new Set([
    category.name.toLowerCase(),
    ...(category.dataCategories || []).map(c => c.toLowerCase())
  ]);
  return allowed.has(dataset.category.toLowerCase());
}

function formatTitle(a, b) {
  return `${a.name} vs ${b.name}`;
}

function filterDisplayPairs(pairs) {
  return pairs.filter(pair => (
    visibleDatasetIds.has(pair.a)
    && visibleDatasetIds.has(pair.b)
    && isCorrelationAllowed(pair)
  ));
}

async function runDiscoveryForCategory(category, limit) {
  const seen = new Set();
  const relevant = DATASET_REGISTRY.filter(dataset => isRelevantToCategory(dataset, category));
  
  // To allow cross-category "spurious" matching, we pair relevant datasets 
  // with EVERYTHING else in the registry.
  const candidates = [];

  relevant.forEach(left => {
    DATASET_REGISTRY.forEach(right => {
      if (left.id === right.id) return;
      const key = pairKey(left.id, right.id);
      if (seen.has(key)) return;
      seen.add(key);
      candidates.push([left, right]);
    });
  });

  const scored = [];
  const chunkSize = 20; // Process in small chunks to avoid network saturation
  
  for (let i = 0; i < candidates.length; i += chunkSize) {
    const chunk = candidates.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(async ([a, b]) => {
      try {
        const [dataA, dataB] = await Promise.all([fetchSeries(a), fetchSeries(b)]);
        const result = scoreCorrelation(dataA, dataB, MIN_DISPLAY_CORRELATION);
        if (!result.passesThreshold) return null;

        return {
          a: a.id,
          b: b.id,
          title: formatTitle(a, b),
          r: result.r,
          absR: result.absR,
          dataPoints: result.years.length,
        };
      } catch {
        return null;
      }
    }));
    scored.push(...chunkResults);
  }

  return scored
    .filter(Boolean)
    .sort((a, b) => b.absR - a.absR || b.dataPoints - a.dataPoints || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export async function discoverCorrelationsForCategory(category, limit = 48) {
  const cacheKey = `discovery_cat_${category.id}_${limit}`;
  const cached = getCached(cacheKey);

  if (cached) {
    const filteredCached = filterDisplayPairs(cached);
    if (filteredCached.length !== cached.length) {
      setCache(cacheKey, filteredCached);
    }
    // Background revalidation
    setTimeout(() => {
      runDiscoveryForCategory(category, limit).then(results => {
        if (results && results.length > 0) {
          setCache(cacheKey, filterDisplayPairs(results));
        }
      }).catch(console.error);
    }, 100);
    return filteredCached;
  }

  // Fallback to precalculated correlations for instant loading
  const precalc = filterDisplayPairs(PRECALCULATED_CORRELATIONS[category.id] || []);
  if (precalc.length > 0) {
    setCache(cacheKey, precalc);
    // Background revalidation to refresh from live APIs
    setTimeout(() => {
      runDiscoveryForCategory(category, limit).then(results => {
        if (results && results.length > 0) {
          setCache(cacheKey, filterDisplayPairs(results));
        }
      }).catch(console.error);
    }, 100);
    return precalc;
  }

  const results = filterDisplayPairs(await runDiscoveryForCategory(category, limit));
  setCache(cacheKey, results);
  return results;
}

async function runDiscoverAllCorrelations(limit) {
  const seen = new Set();
  const candidates = [];

  DATASET_REGISTRY.forEach((a, i) => {
    DATASET_REGISTRY.slice(i + 1).forEach(b => {
      const key = pairKey(a.id, b.id);
      if (seen.has(key)) return;
      seen.add(key);
      candidates.push([a, b]);
    });
  });

  const scored = await Promise.all(candidates.map(async ([a, b]) => {
    try {
      const [dataA, dataB] = await Promise.all([fetchSeries(a), fetchSeries(b)]);
      const result = scoreCorrelation(dataA, dataB, MIN_DISPLAY_CORRELATION);
      if (!result.passesThreshold) return null;

      return {
        a: a.id,
        b: b.id,
        title: formatTitle(a, b),
        r: result.r,
        absR: result.absR,
        dataPoints: result.years.length,
      };
    } catch {
      return null;
    }
  }));

  return scored
    .filter(Boolean)
    .sort((a, b) => b.absR - a.absR || b.dataPoints - a.dataPoints || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export async function discoverAllCorrelations(limit = 128) {
  const cacheKey = `discovery_all_${limit}`;
  const cached = getCached(cacheKey);

  if (cached) {
    const filteredCached = filterDisplayPairs(cached);
    if (filteredCached.length !== cached.length) {
      setCache(cacheKey, filteredCached);
    }
    // Background revalidation
    setTimeout(() => {
      runDiscoverAllCorrelations(limit).then(results => {
        setCache(cacheKey, filterDisplayPairs(results));
      }).catch(console.error);
    }, 100);
    return filteredCached;
  }

  const results = filterDisplayPairs(await runDiscoverAllCorrelations(limit));
  setCache(cacheKey, results);
  return results;
}
