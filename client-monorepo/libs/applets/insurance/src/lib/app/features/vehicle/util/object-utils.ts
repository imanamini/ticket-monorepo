export function objectNullValidation(obj: object): boolean {
  if (obj === null) {
    return false;
  }
  return Object.keys(obj).every(key => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      return objectNullValidation(obj[key]);
    }
    return obj[key] !== null;
  });
}
