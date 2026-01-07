export function containsEnglishCharactersOrNumbers(str: string): boolean {
  const regEx = new RegExp('[a-zA-Z0-9]+');

  return regEx.test(str);
}

export function containsNonNumericCharacters(str: string): boolean {
  const regEx = new RegExp('[^0-9]');
  return regEx.test(str);
}

export function replaceSlashesWithDash(pathName: string): string {
  return pathName.replace(/\//g, '-');
}
