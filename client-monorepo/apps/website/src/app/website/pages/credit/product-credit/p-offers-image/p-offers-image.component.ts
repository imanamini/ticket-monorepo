import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { NgFor, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../../../ui/ui-directive/swiper.directive';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-p-offers-image',
  templateUrl: './p-offers-image.component.html',
  styleUrls: ['./p-offers-image.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class POffersImageComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;

  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  data: any = [];

  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    loop: false,
    slideToClickedSlide: true,
    breakpoints: {
      1280: {
        slidesPerView: 3,
      },
      744: {
        slidesPerView: 1.7,
        spaceBetween: 0,
      },
      577: {
        direction: 'horizontal',
        slidesPerView: 1.7,
      },
      // 320: {
      //   enabled: false,
      //   direction: 'vertical',
      //   slidesPerView: 'auto',
      //   spaceBetween: 12,
      // }
    },
  };
}
