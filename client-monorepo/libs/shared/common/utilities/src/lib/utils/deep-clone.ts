/**
 * Deep clone utility with structuredClone polyfill for older browsers
 * structuredClone is not supported in older mobile browsers (Safari < 15.4, Chrome < 98)
 */
export function deepClone<T>(value: T): T {
  // Use native structuredClone if available (modern browsers)
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  // Fallback for older browsers
  // Note: This doesn't handle all edge cases that structuredClone handles
  // (like circular references, symbols, etc.) but works for most use cases
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    console.error('Deep clone failed:', error);
    // Last resort: return the original value
    return value;
  }
}
