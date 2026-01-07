export function makeEmptyPropsNull(obj: any) {
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === '') {
      obj[key] = null;
    } else if (typeof obj[key] === 'object') {
      makeEmptyPropsNull(obj[key]);
    }
  }
}
