export interface OnBoardingSlidesModel {
  id: number;
  title: string;
  text: string;
  backgroundGradient: GradientColorsModel;
  imageUrl: string;
}

export interface GradientColorsModel {
  firstColorHex?: HexColorModel;
  secondColorHex?: HexColorModel;
  firstColorRGBA?: RgbaColorModel;
  secondColorRGBA?: RgbaColorModel;
  degree: number;
}

export interface HexColorModel {
  color: string;
  alpha: number;
  position: number;
}

export interface RgbaColorModel {
  r: number;
  g: number;
  b: number;
  a: number;
  position: number;
}
