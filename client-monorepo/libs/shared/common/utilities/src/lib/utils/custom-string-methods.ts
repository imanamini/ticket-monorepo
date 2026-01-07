export function stringHasKeyword(baseString: string, keyword: string, sensitive: boolean, place?: 'START' | 'END'): boolean {
  let isValid = false;
  baseString = sensitive ? baseString : baseString.toUpperCase();
  keyword = sensitive ? keyword : keyword.toUpperCase();
  switch (place) {
    case 'START':
      isValid = baseString.startsWith(keyword);
      break;
    case 'END':
      isValid = baseString.endsWith(keyword);
      break;
    default:
      isValid = baseString.includes(keyword);
      break;
  }
  return isValid;
}
