/**
 * Exchange Rate API Service
 * Uses frankfurter.app - free, no API key needed.
 * Docs: https://www.frankfurter.app/docs/
 */
import { fetchWithCache } from '../fetcher';
import { normalizeTimeSeries } from '../normalizer';

const BASE_URL = 'https://api.frankfurter.app';

/**
 * Fetch historical exchange rate for a currency vs EUR for each year.
 * @param {string} currency - Currency code (e.g., 'USD', 'GBP', 'JPY')
 * @param {number} startYear
 * @param {number} endYear
 */
async function fetchYearlyRate(currency = 'USD', startYear = 2005, endYear = 2022) {
  const results = [];

  for (let year = startYear; year <= endYear; year++) {
    try {
      const data = await fetchWithCache(`${BASE_URL}/${year}-06-15`, {
        params: { to: currency },
        cacheKey: `fx-${currency}-${year}`,
      });
      if (data && data.rates && data.rates[currency]) {
        results.push({ year, value: data.rates[currency] });
      }
    } catch {
      // Skip failed years
    }
  }

  return normalizeTimeSeries(results);
}

export const exchangeService = {
  getUSDRate: () => fetchYearlyRate('USD'),
  getGBPRate: () => fetchYearlyRate('GBP'),
  getJPYRate: () => fetchYearlyRate('JPY'),
  getCHFRate: () => fetchYearlyRate('CHF'),
  getINRRate: () => fetchYearlyRate('INR'),
};
