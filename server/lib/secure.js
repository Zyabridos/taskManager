import { createHash } from 'crypto';

/**
 * @param {string} value
 * @returns {string}
 */

export default function encrypt(value) {
  return createHash('sha256').update(value).digest('hex');
}
