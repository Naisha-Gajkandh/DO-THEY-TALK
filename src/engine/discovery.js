import DATASET_REGISTRY, { getDatasetById } from '../data/registry';
import PRECALCULATED_CORRELATIONS from '../data/precalculated';
import { getCached, setCache } from '../api/cache';
import { isCorrelationAllowed } from '../data/contentFilter';
import pythonEngine from './pythonEngine';
import { MIN_DISPLAY_CORRELATION, scoreCorrelation as fallbackScoreCorrelation } from './correlationModel';

const seriesCache = new Map();
const inflightFetches = new Map();
const visibleDatasetIds = new Set(DATASET_REGISTRY.map(dataset => dataset.id));
const PYTHON_DISCOVERY_TIMEOUT_MS = 4500;

function pairKey(aId, bId) {
  return [aId, bId].sort().join('__');
}

function withTimeout(promise, timeoutMs = PYTHON_DISCOVERY_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error('Python discovery timed out'));
    }, timeoutMs);

    promise
      .then(value => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch(error => {
        window.clearTimeout(timer);
        reject(error);
      });
  });
}

async function fetchSeries(dataset) {
  if (seriesCache.has(dataset.id)) {
    return seriesCache.get(dataset.id);
  }

  if (!inflightFetches.has(dataset.id)) {
    const promise = dataset.fetchFn()
      .then(data => {
        seriesCache.set(dataset.id, data);
        inflightFetches.delete(dataset.id);
        return data;
      })
      .catch(error => {
        inflightFetches.delete(dataset.id);
        throw error;
      });
    inflightFetches.set(dataset.id, promise);
  }

  return inflightFetches.get(dataset.id);
}

function isRelevantToCategory(dataset, category) {
  if (category.includeAll) return true;
  const allowed = new Set([
    category.name.toLowerCase(),
    ...(category.dataCategories || []).map(name => name.toLowerCase()),
  ]);
  return allowed.has(dataset.category.toLowerCase());
}

function formatTitle(a, b) {
  return `${a.name} vs ${b.name}`;
}

function normalizePair(pair) {
  const a = getDatasetById(pair.a);
  const b = getDatasetById(pair.b);
  if (!a || !b) return null;

  return {
    a: pair.a,
    b: pair.b,
    title: pair.title && !pair.title.includes('(Left)') ? pair.title : formatTitle(a, b),
    r: Number(pair.r),
    absR: Number(pair.absR ?? Math.abs(pair.r)),
    dataPoints: Number(pair.dataPoints || 0),
  };
}

function filterDisplayPairs(pairs) {
  return pairs
    .map(normalizePair)
    .filter(pair => (
      pair
      && visibleDatasetIds.has(pair.a)
      && visibleDatasetIds.has(pair.b)
      && isCorrelationAllowed(pair)
    ));
}

function getPrecalculatedPairsForCategory(category) {
  const keys = [category.id, ...(category.precalculatedKeys || [])];
  const seen = new Set();
  const pairs = [];

  keys.forEach(key => {
    (PRECALCULATED_CORRELATIONS[key] || []).forEach(pair => {
      const keyName = pairKey(pair.a, pair.b);
      if (seen.has(keyName)) return;
      seen.add(keyName);
      pairs.push(pair);
    });
  });

  return filterDisplayPairs(pairs);
}

async function discoverForLeftDataset(left, rightPool, limit) {
  const leftData = await fetchSeries(left);
  const candidatePayload = [];

  for (const right of rightPool) {
    try {
      candidatePayload.push({
        id: right.id,
        name: right.name,
        data: await fetchSeries(right),
      });
    } catch {
      // Ignore individual source failures. The remaining streams still tell a story.
    }
  }

  if (!candidatePayload.length) return [];

  try {
    const pythonResults = await withTimeout(
      pythonEngine.discoverCorrelations(
        left.id,
        leftData,
        candidatePayload,
        MIN_DISPLAY_CORRELATION,
        limit
      )
    );

    return filterDisplayPairs(pythonResults.map(pair => ({
      ...pair,
      title: formatTitle(left, getDatasetById(pair.b) || { name: pair.b }),
    })));
  } catch {
    const fallbackResults = [];

    for (const right of rightPool) {
      try {
        const rightData = await fetchSeries(right);
        const result = fallbackScoreCorrelation(leftData, rightData, MIN_DISPLAY_CORRELATION);
        if (!result.passesThreshold) continue;

        fallbackResults.push({
          a: left.id,
          b: right.id,
          title: formatTitle(left, right),
          r: result.r,
          absR: result.absR,
          dataPoints: result.years.length,
        });
      } catch {
        // Skip individual failures during the fallback pass.
      }
    }

    return filterDisplayPairs(fallbackResults);
  }
}

async function runDiscoveryForCategory(category, limit) {
  const relevant = DATASET_REGISTRY.filter(dataset => isRelevantToCategory(dataset, category));
  const seen = new Set();
  const jobs = [];

  relevant.forEach(left => {
    const rightPool = DATASET_REGISTRY.filter(right => {
      if (left.id === right.id) return false;
      const key = pairKey(left.id, right.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (rightPool.length) {
      jobs.push([left, rightPool]);
    }
  });

  const discovered = [];
  const chunkSize = 3;

  for (let i = 0; i < jobs.length; i += chunkSize) {
    const chunk = jobs.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(
      chunk.map(([left, rightPool]) => discoverForLeftDataset(left, rightPool, limit))
    );
    discovered.push(...chunkResults.flat());
  }

  return filterDisplayPairs(discovered)
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
    window.setTimeout(() => {
      runDiscoveryForCategory(category, limit)
        .then(results => {
          if (results.length > 0) setCache(cacheKey, results);
        })
        .catch(console.error);
    }, 100);
    return filteredCached;
  }

  const precalculated = getPrecalculatedPairsForCategory(category).slice(0, limit);
  if (precalculated.length > 0) {
    setCache(cacheKey, precalculated);
    window.setTimeout(() => {
      runDiscoveryForCategory(category, limit)
        .then(results => {
          if (results.length > 0) setCache(cacheKey, results);
        })
        .catch(console.error);
    }, 100);
    return precalculated;
  }

  const results = await runDiscoveryForCategory(category, limit);
  setCache(cacheKey, results);
  return results;
}

async function runDiscoverAllCorrelations(limit) {
  return runDiscoveryForCategory({ id: 'all', name: 'All', includeAll: true }, limit);
}

export async function discoverAllCorrelations(limit = 128) {
  const cacheKey = `discovery_all_${limit}`;
  const cached = getCached(cacheKey);

  if (cached) {
    const filteredCached = filterDisplayPairs(cached);
    if (filteredCached.length !== cached.length) {
      setCache(cacheKey, filteredCached);
    }
    window.setTimeout(() => {
      runDiscoverAllCorrelations(limit)
        .then(results => setCache(cacheKey, results))
        .catch(console.error);
    }, 100);
    return filteredCached;
  }

  const results = await runDiscoverAllCorrelations(limit);
  setCache(cacheKey, results);
  return results;
}
