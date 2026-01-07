import { DestroyRef, inject, Injectable, Renderer2 } from '@angular/core';
import { ScrollAnimationConfig } from '../models/scroll-animation-config';
import { CssMotionGeneratorService } from './css-motion-generator.service';

@Injectable()
export class ScrollAnimationService {
  private styleSheet: HTMLStyleElement | null = null;
  private renderer = inject(Renderer2);
  private destroyRef = inject(DestroyRef);
  private listenerFunction?: () => void;
  private scrollContainer?: HTMLElement;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.listenerFunction && this.scrollContainer) {
        this.scrollContainer.removeEventListener('scroll', this.listenerFunction);
        this.listenerFunction = undefined;
        this.scrollContainer = undefined;
      }
    });
  }

  private supportsTimeline(): boolean {
    return CSS.supports?.('animation-timeline: scroll(nearest y)') ?? false;
  }

  private createKeyframes(name: string, config: ScrollAnimationConfig) {
    if (!this.styleSheet) {
      this.styleSheet = document.createElement('style');
      document.head.appendChild(this.styleSheet);
    }

    const startProps = Object.entries(config.start)
      .map(([k, v]) => `${k}: ${v};`)
      .join('');

    const endProps = Object.entries(config.end)
      .map(([k, v]) => `${k}: ${v};`)
      .join('');

    const css = `
      @keyframes ${name} {
        from { ${startProps} }
        to { ${endProps} }
      }
    `;
    this.styleSheet.sheet?.insertRule(css, this.styleSheet.sheet.cssRules.length);
  }

  applyAnimation(container: HTMLElement, target: HTMLElement, config: ScrollAnimationConfig, animationName: string) {
    if (this.supportsTimeline()) {
      // Generate keyframes + apply CSS scroll animation
      this.createKeyframes(animationName, config);

      this.renderer.setStyle(target, 'animation', `${animationName} 1s both`);
      this.renderer.setStyle(target, 'animation-timeline', 'scroll(nearest y)');
      this.renderer.setStyle(target, 'animation-range', `entry ${config.scrollFrom}px cover ${config.scrollTo}px`);
    } else {
      // JS fallback
      let ticking = false;

      const clamp = (v: number) => Math.max(0, Math.min(1, v));

      const update = () => {
        ticking = false;
        const range = config.scrollTo - config.scrollFrom;
        const progress = clamp((container.scrollTop - config.scrollFrom) / range);

        // interpolate between start and end
        for (const prop in config.start) {
          const startVal = config.start[prop as keyof CSSStyleDeclaration];
          const endVal = config.end[prop as keyof CSSStyleDeclaration];
          if (startVal && endVal) {
            CssMotionGeneratorService.setAnimatedStyle(this.renderer, target, prop, startVal as string, endVal as string, progress);
          }
        }
      };

      this.listenerFunction = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };

      this.scrollContainer = container;
      container.addEventListener('scroll', this.listenerFunction, { passive: true });

      update();
    }
  }
}
