import { inject, Injectable, signal } from '@angular/core';

import { Action } from '@client-monorepo/common/action-handler';
import { Banner, LayoutService, Slide } from '@client-monorepo/common/utilities';
import { SlideData } from '../models/slide-data';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  observer!: IntersectionObserver;
  isInViewport = signal<Record<string, boolean>>({});
  private cashedDataOfBanners: Record<string, any> = {};
  layout = inject(LayoutService);

  bannerMapper(banners: Banner[]): Banner[] {
    if (!banners || !Array.isArray(banners)) {
      return [];
    }
    return banners.map((item) => {
      let slides = this.generateSlidesExtractedData(item.slides, item.type === 'Carousel' || item.type === 'Partial-View-Carousel');
      if (item.type === 'Carousel' || item.type === 'Partial-View-Carousel') {
        slides = slides.slice(0, 5);
      }
      return {
        ...item,
        extractedConfig: item.config ? JSON.parse(item.config) : undefined,
        slides,
      };
    }) as Banner[];
  }

  generateSlidesExtractedData(slides: Slide[], randomizeOrder = true): Slide[] {
    return this.sortSlides(slides, randomizeOrder).map((slide) => {
      return {
        ...slide,
        extractedData: JSON.parse(slide.data) as SlideData,
        extractedAction: JSON.parse(slide.action) as Action,
      } as Slide;
    });
  }

  private sortSlides(slides: Slide[], randomizeOrder = false): Slide[] {
    if (!randomizeOrder) {
      return slides.sort((a, b) => a.order - b.order);
    }
    return this.weightedShuffle<Slide>(
      slides,
      slides.map((slide) => slide.order),
    );
  }

  private weightedShuffle<T>(items: T[], weights: number[]): T[] {
    const paired = items.map((item, i) => ({
      item,
      key: Math.pow(Math.random(), 1 / weights[i]),
    }));

    paired.sort((a, b) => a.key - b.key);

    return paired.map((p) => p.item);
  }

  initialIntersectionObserver(element: Element): void {
    try {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.isInViewport.update((ex) => {
                ex[element.id] = true;
                return { ...ex };
              });
            } else {
              this.isInViewport.update((ex) => {
                ex[element.id] = false;
                return { ...ex };
              });
            }
          });
        },
        {
          root: this.layout.scrollContainer,
          rootMargin: '100px',
        },
      );
      this.observer.observe(element);
    } catch {}
  }

  updateCash(uniqId: string, data: any): void {
    this.cashedDataOfBanners[uniqId] = data;
  }

  readFromCache(uniqId: string): any {
    return this.cashedDataOfBanners[uniqId];
  }
}
