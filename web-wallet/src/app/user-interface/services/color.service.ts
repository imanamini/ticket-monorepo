import { Injectable } from '@angular/core';

@Injectable()
export class ColorService {

  static convertDecimalToRgbA(integerColor: number, alpha: number): string {
    let r = (integerColor >> 16) & 255;
    let g = (integerColor >> 8) & 255;
    let b = integerColor & 255;
    return `rgba(${r},${g},${b}, ${alpha})`;
  }

  static convertDecimalToRgb(integerColor: number): string {
    let r = (integerColor >> 16) & 255;
    let g = (integerColor >> 8) & 255;
    let b = integerColor & 255;
    return `rgb(${r},${g},${b})`;
  }
}
