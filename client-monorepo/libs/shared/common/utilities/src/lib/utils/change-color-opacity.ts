export class ChangeColorOpacity {
  public static addOpacity(color: string, opacity: number): string {
    const rgb = ChangeColorOpacity.colorToRgb(color);
    if (rgb) {
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
    }
    return color;
  }

  public static colorToRgb(color: string): number[] | null {
    const namedColors: { [key: string]: string } = {
      black: '#000000',
      blue: '#0000FF',
      brown: '#A52A2A',
      cyan: '#00FFFF',
      green: '#008000',
      grey: '#808080',
      magenta: '#FF00FF',
      orange: '#FFA500',
      purple: '#800080',
      red: '#FF0000',
      white: '#FFFFFF',
      yellow: '#FFFF00',
      // add more colors as needed
    };

    if (namedColors[color.toLowerCase()]) {
      color = namedColors[color.toLowerCase()];
    }

    // Check if it's a hex color
    if (color[0] === '#') {
      color = color.slice(1);
      if (color.length === 3) {
        color = color
          .split('')
          .map((c) => c + c)
          .join('');
      }
      const num = parseInt(color, 16);
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }

    // Add more color parsing if needed
    return null;
  }

  public static convertDecimalToRgba(integerColor: number, alpha = 1): string {
    const r = (integerColor >> 16) & 255;
    const g = (integerColor >> 8) & 255;
    const b = integerColor & 255;
    return `rgba(${r},${g},${b}, ${alpha})`;
  }
}
