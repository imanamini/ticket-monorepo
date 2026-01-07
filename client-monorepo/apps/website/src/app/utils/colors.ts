export const luminance = (color: string): number => {
  let colors;
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
      red: parseInt(color.substr(0, 2), 16),
      green: parseInt(color.substr(2, 2), 16),
      blue: parseInt(color.substr(4, 2), 16),
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
