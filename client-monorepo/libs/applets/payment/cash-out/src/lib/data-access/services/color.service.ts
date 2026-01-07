import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  getRGBA(integerColor: number, isBorder: boolean): string {
    const r = (integerColor >> 16) & 255;
    const g = (integerColor >> 8) & 255;
    const b = integerColor & 255;

    const a = isBorder ? 1 : 0.1;
    return `rgba(${r},${g},${b},${a})`;
  }

  getRGB(integerColor: number): string {
    const r = (integerColor >> 16) & 255;
    const g = (integerColor >> 8) & 255;
    const b = integerColor & 255;
    return `rgb(${r},${g},${b})`;
  }

  getRgbaAndApplyAlpha(integerColor: number, alpha: number): string {
    const r = (integerColor >> 16) & 255;
    const g = (integerColor >> 8) & 255;
    const b = integerColor & 255;
    return `rgba(${r},${g},${b}, ${alpha})`;
  }

  static convertDecimalToRgb(integerColor: number): string {
    const r = (integerColor >> 16) & 255;
    const g = (integerColor >> 8) & 255;
    const b = integerColor & 255;
    return `rgb(${r},${g},${b})`;
  }

  static convertDecimalToRgba(integerColor: number, alpha: number): string {
    const r = (integerColor >> 16) & 255;
    const g = (integerColor >> 8) & 255;
    const b = integerColor & 255;
    return `rgba(${r},${g},${b}, ${alpha})`;
  }
}
