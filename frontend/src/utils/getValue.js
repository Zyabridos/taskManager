/**
 * Provides access to nested object properties by path string.
 *
 * @param {Object} obj - The object to extract the value from.
 * @param {string} path - The dot-separated string path (e.g., 'executor.firstName').
 * @returns {*} - The value at the given path or an empty string if undefined.
 *
 * Example:
 * const task = {
 *  executor: {
 *    firstName: 'Nina,
 *    }
 * }
 *
 * getValue(task, 'executor.firstName') // => 'Nina'
 * getValue(user, 'executor.lastName'); // ''
 */
const getValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? '';
};

export default getValue;
