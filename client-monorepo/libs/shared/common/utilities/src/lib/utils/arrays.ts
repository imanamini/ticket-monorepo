export function shuffleArray(pureArray: any[]): any[] {
  let i = pureArray.length;
  let j: number;
  let temp = [];
  if (i === 0) {
    return pureArray;
  }
  while (--i) {
    j = Math.floor(Math.random() * (i + 1));
    temp = pureArray[i];
    pureArray[i] = pureArray[j];
    pureArray[j] = temp;
  }
  return pureArray;
}

export function flattenArray(arr: any[]): any[] {
  return [].concat(...arr);
}
