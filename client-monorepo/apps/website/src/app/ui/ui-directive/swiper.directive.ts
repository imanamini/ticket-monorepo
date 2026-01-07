import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  PLATFORM_ID
} from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { isPlatformBrowser } from '@angular/common';
import Swiper from 'swiper';

@Directive({
  selector: '[appSwiper]',
  standalone: true,
  exportAs: 'appSwiper',
})
export class SwiperDirective implements AfterViewInit, OnDestroy {
  @Input() config?: SwiperOptions;
  @Output() slideChange = new EventEmitter<void>();
  @Output() initialized = new EventEmitter<void>();

  private swiperInstance: Swiper | undefined;

  constructor(
    private el: ElementRef<SwiperContainer>,
    @Inject(PLATFORM_ID) private platformId: string,
    private cdr:ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const defaultConfig = {
        on: {
          slideChange: () => {
            this.slideChange.emit();
          },
        },
      };

      // Merge default config with user config
      const finalConfig = { ...defaultConfig, ...this.config };

      Object.assign(this.el.nativeElement, finalConfig);
      if (this.el && this.el.nativeElement) {
        if (typeof this.el.nativeElement.initialize === 'function') {
          this.el.nativeElement.initialize();
        } else {
          console.warn('initialize is not a function on nativeElement');
        }
        this.swiperInstance = this.el.nativeElement.swiper;
      }

      // Swiper instance may not be immediately available
      setTimeout(() => {
        this.swiperInstance = this.el.nativeElement.swiper;
        if (this.swiperInstance) {
          this.initialized.emit(); // 🔥 notify parent
          this.cdr.markForCheck(); // trigger Angular to update
        }
      });
    }
  }

  slideNext(): void {
    if (this.swiperInstance) {
      this.swiperInstance.slideNext();
    }
  }

  slidePrev(): void {
    if (this.swiperInstance) {
      this.swiperInstance.slidePrev();
    }
  }

  get swiper(): Swiper | undefined {
    return this.swiperInstance;
  }

  ngOnDestroy(): void {
    if (this.swiperInstance) {
      this.swiperInstance.destroy();
    }
  }
}
