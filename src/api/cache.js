/**
 * API Response Cache
 * TTL-based cache using localStorage for persistence, with in-memory fallback.
 */
const CACHE_PREFIX = 'sc_cache_';
const DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes

const memoryFallback = new Map();

function getStorage() {
  try {
    return window.localStorage;
  } catch (e) {
    return null;
  }
}

export function getCached(key) {
  const fullKey = CACHE_PREFIX + key;
  const storage = getStorage();

  if (storage) {
    try {
      const item = storage.getItem(fullKey);
      if (item) {
        const entry = JSON.parse(item);
        if (Date.now() - entry.timestamp > entry.ttl) {
          storage.removeItem(fullKey);
          return null;
        }
        return entry.data;
      }
    } catch (e) {
      console.warn('Cache read failed:', e);
    }
  }

  // Fallback
  const entry = memoryFallback.get(fullKey);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) {
    memoryFallback.delete(fullKey);
    return null;
  }
  return entry.data;
}

export function setCache(key, data, ttl = DEFAULT_TTL) {
  const fullKey = CACHE_PREFIX + key;
  const entry = { data, timestamp: Date.now(), ttl };
  const storage = getStorage();

  if (storage) {
    try {
      storage.setItem(fullKey, JSON.stringify(entry));
    } catch (e) {
      console.warn('Cache write failed (quota?):', e);
      // Fallback if full or error
      memoryFallback.set(fullKey, entry);
    }
  } else {
    memoryFallback.set(fullKey, entry);
  }
}

export function clearCache() {
  const storage = getStorage();
  if (storage) {
    try {
      for (let i = storage.length - 1; i >= 0; i--) {
        const key = storage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          storage.removeItem(key);
        }
      }
    } catch (e) {
      console.warn('Cache clear failed:', e);
    }
  }
  memoryFallback.clear();
}

export function getCacheSize() {
  let count = 0;
  const storage = getStorage();
  if (storage) {
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) count++;
    }
  }
  return count + memoryFallback.size;
}
