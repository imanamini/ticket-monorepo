import { Renderer2 } from '@angular/core';

export class CssMotionGeneratorService {
  private static linearChangeValue(s: number, e: number, t: number): number {
    return s + (e - s) * t;
  }

  private static parseColor(color: string): [number, number, number] {
    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.fillStyle = color;
    const rgb = ctx.fillStyle.match(/\d+/g)?.map(Number) || [0, 0, 0];
    return [rgb[0], rgb[1], rgb[2]];
  }

  public static setAnimatedStyle(renderer: Renderer2, target: any, prop: string, startVal: string, endVal: string, progress: number) {
    // opacity
    if (prop === 'opacity') {
      const val = this.linearChangeValue(parseFloat(startVal), parseFloat(endVal), progress);
      renderer.setStyle(target, prop, val.toString());
      return;
    }

    // transform (translate, scale, rotate, skew)
    if (prop === 'transform') {
      const transformTypes = [
        { name: 'translateX', unit: 'px' },
        { name: 'translateY', unit: 'px' },
        { name: 'translateZ', unit: 'px' },
        { name: 'scale', unit: '' },
        { name: 'rotate', unit: 'deg' },
        { name: 'skew', unit: 'deg' },
      ];

      const output: string[] = [];
      for (const t of transformTypes) {
        const regex = new RegExp(`${t.name}\\(([-\\d.]+)${t.unit}\\)`);
        const sMatch = startVal.match(regex);
        const eMatch = endVal.match(regex);
        if (sMatch && eMatch) {
          const s = parseFloat(sMatch[1]);
          const e = parseFloat(eMatch[1]);
          const val = this.linearChangeValue(s, e, progress);
          output.push(`${t.name}(${val}${t.unit})`);
        }
      }
      renderer.setStyle(target, prop, output.join(' '));
    }

    // colors
    if (['color', 'background-color', 'border-color'].includes(prop)) {
      const s = this.parseColor(startVal);
      const e = this.parseColor(endVal);
      const r = Math.round(this.linearChangeValue(s[0], e[0], progress));
      const g = Math.round(this.linearChangeValue(s[1], e[1], progress));
      const b = Math.round(this.linearChangeValue(s[2], e[2], progress));
      renderer.setStyle(target, prop, `rgb(${r},${g},${b})`);
      return;
    }

    // spacing & position (px)
    if (['margin', 'padding', 'top', 'right', 'bottom', 'left'].includes(prop)) {
      const val = this.linearChangeValue(parseFloat(startVal), parseFloat(endVal), progress);
      renderer.setStyle(target, prop, `${val}px`);
      return;
    }
  }
}
