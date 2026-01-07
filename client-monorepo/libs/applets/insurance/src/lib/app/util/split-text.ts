export function splitText(inputString: string): string[] {
  const isEnglish = (charCode: number) => (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
  const isPersian = (charCode: number) => charCode >= 1536 && charCode <= 1791;
  let englishStart = -1, restStart = -1;

  if (inputString) {
    for (let i = 0; i < inputString.length; i++) {
      if (isEnglish(inputString.charCodeAt(i))) {
        englishStart = i;
        break;
      }
    }

    if (englishStart === -1) {
      return [inputString, '', ''];
    }

    for (let i = englishStart; i < inputString?.length; i++) {
      if (isPersian(inputString.charCodeAt(i))) {
        restStart = i;
        break;
      }
      if (i === inputString.length - 1) {
        restStart = inputString.length;
      }
    }
  }

  const part1: string = inputString.substring(0, restStart);
  const part2: string = inputString.substring(restStart);
  return [part1, part2];
}
