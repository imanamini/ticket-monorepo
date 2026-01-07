export const convertDecimalToRgb = (integerColor: number): string => {
  // tslint:disable-next-line:no-bitwise
  const r = (integerColor >> 16) & 255;
  // tslint:disable-next-line:no-bitwise
  const g = (integerColor >> 8) & 255;
  // tslint:disable-next-line:no-bitwise
  const b = integerColor & 255;
  return `rgb(${r},${g},${b})`;
};

export const convertDecimalToRgba = (integerColor: number, alpha: number): string => {
  // tslint:disable-next-line:no-bitwise
  const r = (integerColor >> 16) & 255;
  // tslint:disable-next-line:no-bitwise
  const g = (integerColor >> 8) & 255;
  // tslint:disable-next-line:no-bitwise
  const b = integerColor & 255;
  return `rgba(${r},${g},${b}, ${alpha})`;
};

export const luminance = (hexColor: string): number => {
  hexColor = hexColor.replace(/^\s*#|\s*$/g, '');

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (hexColor.length === 3) {
    hexColor = hexColor.replace(/(.)/g, '$1$1');
  }

  const colors = {
    red: parseInt(hexColor.substr(0, 2), 16),
    green: parseInt(hexColor.substr(2, 2), 16),
    blue: parseInt(hexColor.substr(4, 2), 16)
  };

  for (const i in colors) {
    if (colors.hasOwnProperty(i)) {
      let c = colors[i] / 255;
      if (c < 0.03928) {
        c = c / 12.92;
      } else {
        c = (c + .055) / 1.055;
        c = Math.pow(c, 2.4);
      }
      colors[i] = c;
    }
  }

  return colors.red * .2126 + colors.green * .7152 + colors.blue * .0722;
};
