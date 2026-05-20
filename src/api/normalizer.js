/**
 * Data Normalization Utilities
 * Converts varied API response formats into a standard: [{ year: number, value: number }]
 */

/**
 * Normalize data into the standard format, sorted by year ascending.
 * Filters out entries with null/undefined/NaN values.
 * @param {Array} rawData - Array of objects
 * @param {string} yearField - The key for the year
 * @param {string} valueField - The key for the value
 * @returns {Array<{year: number, value: number}>}
 */
export function normalizeTimeSeries(rawData, yearField = 'year', valueField = 'value') {
  if (!Array.isArray(rawData)) return [];

  return rawData
    .map(item => ({
      year: parseInt(item[yearField], 10),
      value: parseFloat(item[valueField]),
    }))
    .filter(d => !isNaN(d.year) && !isNaN(d.value) && d.value !== null)
    .sort((a, b) => a.year - b.year);
}

/**
 * Align two datasets so they share the same years.
 * Only keeps years present in BOTH datasets.
 */
export function alignDatasets(dataA, dataB) {
  const mapA = new Map(dataA.map(d => [d.year, d.value]));
  const mapB = new Map(dataB.map(d => [d.year, d.value]));

  const commonYears = [...mapA.keys()].filter(y => mapB.has(y)).sort((a, b) => a - b);

  return {
    years: commonYears,
    valuesA: commonYears.map(y => mapA.get(y)),
    valuesB: commonYears.map(y => mapB.get(y)),
  };
}

/**
 * Interpolate missing years in a dataset using linear interpolation.
 */
export function interpolateMissing(data, startYear, endYear) {
  if (data.length === 0) return [];
  const map = new Map(data.map(d => [d.year, d.value]));
  const result = [];

  for (let y = startYear; y <= endYear; y++) {
    if (map.has(y)) {
      result.push({ year: y, value: map.get(y) });
    } else {
      // Find nearest before and after
      const before = data.filter(d => d.year < y).pop();
      const after = data.find(d => d.year > y);
      if (before && after) {
        const ratio = (y - before.year) / (after.year - before.year);
        const interpolated = before.value + ratio * (after.value - before.value);
        result.push({ year: y, value: Math.round(interpolated * 100) / 100 });
      }
    }
  }
  return result;
}
