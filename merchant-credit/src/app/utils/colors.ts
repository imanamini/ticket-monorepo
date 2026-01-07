export const convertDecimalToRgb = (integerColor: number): string => {
  // tslint:disable-next-line:no-bitwise
  const r = (integerColor >> 16) & 255;
  // tslint:disable-next-line:no-bitwise
  const g = (integerColor >> 8) & 255;
  // tslint:disable-next-line:no-bitwise
  const b = integerColor & 255;
  return `rgb(${r},${g},${b})`;
};
