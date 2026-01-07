import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  static convertDecimalToRgb(integerColor: number): string {
    let r = (integerColor >> 16) & 255;
    let g = (integerColor >> 8) & 255;
    let b = integerColor & 255;
    return `rgb(${r},${g},${b})`;
  }

  static convertDecimalToRgba(integerColor: number, alpha: number): string {
    let r = (integerColor >> 16) & 255;
    let g = (integerColor >> 8) & 255;
    let b = integerColor & 255;
    return `rgba(${r},${g},${b}, ${alpha})`;
  }

  getRGBA(integerColor: number, isBorder: boolean): string {

    let r = (integerColor >> 16) & 255;
    let g = (integerColor >> 8) & 255;
    let b = integerColor & 255;

    let a = isBorder ? 1 : 0.1;
    let rgba = `rgba(${r},${g},${b},${a})`;
    return rgba;
  }

  getRGB(integerColor: number): string {
    let r = (integerColor >> 16) & 255;
    let g = (integerColor >> 8) & 255;
    let b = integerColor & 255;
    let rgb = `rgb(${r},${g},${b})`;
    return rgb;
  }

  getRgbaAndApplyAlpha(integerColor: number, alpha: number): string {
    let r = (integerColor >> 16) & 255;
    let g = (integerColor >> 8) & 255;
    let b = integerColor & 255;
    let rgb = `rgba(${r},${g},${b}, ${alpha})`;
    return rgb;
  }
}
