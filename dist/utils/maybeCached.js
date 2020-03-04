/* global CacheService PropertiesService: true */

function maybeCached(propName, fn, seconds) {
  const cached = CacheService.getScriptCache().get(propName);

  const some = cached || fn();

  if (!cached) {
    const expiration = seconds || 600;
    CacheService.getScriptCache().put(propName, some, expiration);
  }
  return some;
}

export function maybeCachedProp(key) {
  return maybeCached(key, () => PropertiesService.getScriptProperties().getProperty(key));
}

export default maybeCached;
