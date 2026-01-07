export function createFilledArray(length: number, value: any): any[] {
  return Array(length).fill(value);
}

export function createFilledTwoDimArray(rows: number, cols: number, value: any): Array<Array<any>> {
  return Array.from({length: rows}, () => Array(cols).fill(value));
}
