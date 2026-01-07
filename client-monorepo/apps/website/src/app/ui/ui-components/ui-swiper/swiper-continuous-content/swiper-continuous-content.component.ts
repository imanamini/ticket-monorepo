import { Component, effect, ElementRef, input, signal, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { SwiperDirective } from '../../../ui-directive/swiper.directive';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-swiper-continuous-content',
  templateUrl: './swiper-continuous-content.component.html',
  styleUrls: ['./swiper-continuous-content.component.scss'],
  standalone: true,
  imports: [SwiperDirective],
})
export class SwiperContinuousContentComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  index = signal(0);
  title = input<string>('');
  subtitle = input<string>('');
  data = input<any[]>([]);

  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    loop: true,
    slideToClickedSlide: true,
    breakpoints: {
      1280: {
        slidesPerView: 4,
      },
      850: {
        slidesPerView: 2.9,
      },
      744: {
        slidesPerView: 2.3,
      },
      577: {
        slidesPerView: 1.7,
      },
      320: {
        slidesPerView: 1.2,
      },
      280: {
        slidesPerView: 1.1,
        spaceBetween: 20,
      },
    },
  };

  constructor() {
    // Effect to sync Swiper index
    effect(() => {
      if (this.swiper?.nativeElement?.swiper) {
        this.swiper.nativeElement.swiper.activeIndex = this.index();
      }
    });
  }
}
