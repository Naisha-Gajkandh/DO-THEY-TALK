/**
 * Reusable Fetch Utility with caching, retries, and error handling.
 */
import axios from 'axios';
import { getCached, setCache } from './cache';

const DEFAULT_TIMEOUT = 15000;
const MAX_RETRIES = 2;

/**
 * Fetches data from a URL with caching, retries, and error handling.
 * @param {string} url - The URL to fetch
 * @param {object} options - { params, cacheKey, cacheTtl, retries, timeout }
 * @returns {Promise<any>} - The response data
 */
export async function fetchWithCache(url, options = {}) {
  const {
    params = {},
    cacheKey = null,
    cacheTtl = undefined,
    retries = MAX_RETRIES,
    timeout = DEFAULT_TIMEOUT,
  } = options;

  // Build cache key from URL + params if not provided
  const key = cacheKey || `${url}?${JSON.stringify(params)}`;

  // Check cache first
  const cached = getCached(key);
  if (cached) return cached;

  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, {
        params,
        timeout,
        headers: { 'Accept': 'application/json' },
      });
      const data = response.data;
      setCache(key, data, cacheTtl);
      return data;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        // Exponential backoff
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw new Error(
    `Failed to fetch ${url} after ${retries + 1} attempts: ${lastError?.message || 'Unknown error'}`
  );
}
