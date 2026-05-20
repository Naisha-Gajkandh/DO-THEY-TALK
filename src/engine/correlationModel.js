import { sampleCorrelation } from 'simple-statistics';
import { interpolateMissing } from '../api/normalizer';

export const MIN_DISPLAY_CORRELATION = 0.87;

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function clampOutliers(data) {
  if (data.length < 5) return data;
  const values = data.map(d => d.value);
  const med = median(values);
  const deviations = values.map(v => Math.abs(v - med));
  const mad = median(deviations) || 1;
  const limit = mad * 6;

  return data.map(d => ({
    ...d,
    value: Math.max(med - limit, Math.min(med + limit, d.value)),
  }));
}

function cleanSeries(data) {
  const byYear = new Map();

  data.forEach(point => {
    const year = Number.parseInt(point.year, 10);
    const value = Number.parseFloat(point.value);
    if (!Number.isFinite(year) || !Number.isFinite(value)) return;
    if (year < 1900 || year > 2100) return;

    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year).push(value);
  });

  const averaged = [...byYear.entries()]
    .map(([year, values]) => ({
      year,
      value: values.reduce((sum, value) => sum + value, 0) / values.length,
    }))
    .sort((a, b) => a.year - b.year);

  return clampOutliers(averaged);
}

function alignAndImpute(dataA, dataB) {
  const cleanA = cleanSeries(dataA);
  const cleanB = cleanSeries(dataB);
  if (!cleanA.length || !cleanB.length) {
    return { years: [], valuesA: [], valuesB: [] };
  }

  const startYear = Math.max(cleanA[0].year, cleanB[0].year);
  const endYear = Math.min(cleanA[cleanA.length - 1].year, cleanB[cleanB.length - 1].year);
  if (endYear < startYear) return { years: [], valuesA: [], valuesB: [] };

  const filledA = interpolateMissing(cleanA, startYear, endYear);
  const filledB = interpolateMissing(cleanB, startYear, endYear);
  const mapA = new Map(filledA.map(d => [d.year, d.value]));
  const mapB = new Map(filledB.map(d => [d.year, d.value]));
  const years = [...mapA.keys()].filter(year => mapB.has(year)).sort((a, b) => a - b);

  return {
    years,
    valuesA: years.map(year => mapA.get(year)),
    valuesB: years.map(year => mapB.get(year)),
  };
}

function normalize(values) {
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / values.length;
  const std = Math.sqrt(variance) || 1;
  return values.map(value => (value - avg) / std);
}

export function scoreCorrelation(dataA, dataB, minCorrelation = MIN_DISPLAY_CORRELATION) {
  const { years, valuesA, valuesB } = alignAndImpute(dataA, dataB);

  if (years.length < 6) {
    return {
      years,
      valuesA,
      valuesB,
      r: 0,
      rSquared: 0,
      absR: 0,
      passesThreshold: false,
      confidence: 0,
      reason: 'Not enough overlapping annual data after cleaning.',
    };
  }

  const r = sampleCorrelation(normalize(valuesA), normalize(valuesB));
  const absR = Math.abs(r);
  const overlapConfidence = Math.min(1, years.length / 12);
  const thresholdMargin = Math.max(0, (absR - minCorrelation) / (1 - minCorrelation));

  return {
    years,
    valuesA,
    valuesB,
    r,
    rSquared: r * r,
    absR,
    passesThreshold: absR >= minCorrelation,
    confidence: Math.round((0.65 * overlapConfidence + 0.35 * thresholdMargin) * 100) / 100,
    reason: absR >= minCorrelation
      ? 'The cleaned annual series passes the display threshold.'
      : `The cleaned annual series is below the r >= ${minCorrelation.toFixed(2)} display threshold.`,
  };
}
