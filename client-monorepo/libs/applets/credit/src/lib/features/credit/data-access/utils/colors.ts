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

export const luminance = (color: string): number => {
  let colors: any;
  if (color.search('rgb') >= 0) {
    const colorRGB = color
      .trim()
      .replace('rgba', '')
      .replace('rgb', '')
      .replace('(', '')
      .replace(')', '')
      .split(',')
      .map((item) => parseInt(item, 10));
    colors = {
      red: colorRGB[0],
      green: colorRGB[1],
      blue: colorRGB[2],
    };
  } else {
    color = color.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (color.length === 3) {
      color = color.replace(/(.)/g, '$1$1');
    }

    colors = {
      red: parseInt(color.substring(0, 2), 16),
      green: parseInt(color.substring(2, 4), 16),
      blue: parseInt(color.substring(4, 6), 16),
    };
  }
  for (const i in colors) {
    if (colors.hasOwnProperty(i)) {
      let c = colors[i] / 255;
      if (c < 0.03928) {
        c = c / 12.92;
      } else {
        c = (c + 0.055) / 1.055;
        c = Math.pow(c, 2.4);
      }
      colors[i] = c;
    }
  }

  return colors.red * 0.2126 + colors.green * 0.7152 + colors.blue * 0.0722;
};
