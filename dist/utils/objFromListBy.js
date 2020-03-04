import R from 'ramda';

/**
 * Make an object from list, as key use specified value from each element
 * @sig callback -> list -> object
 * @param {Function} callback Path to value, which will be used as key.
 *
 * @returns function, that takes an array
 *
 * @example
 * ```JS
 * const list = [
 *   { id: '1', info: { name: 'John', age: 30 } }
 *   { id: '2', info: { name: 'Grant', age: 42 } }
 * ]
 *
 * const byId = objFromListBy(item => item.id)
 *
 * ```
 */
function objFromListBy(callback) {
  return R.chain(R.zipObj, R.map(callback));
}

export function objFromListByPath(path) {
  return objFromListBy(R.path(path));
}

export function objFromListByPathString(string) {
  return objFromListByPath(string.split('.'));
}

export function objFromListByKey(key) {
  return objFromListByPath([key]);
}

export default objFromListBy;
