import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ValueCards } from '../../../models/value/value-cards';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { SwiperDirective } from '../../../ui-directive/swiper.directive';

@Component({
  selector: 'app-ui-value-swiper',
  templateUrl: './ui-value-swiper.component.html',
  styleUrls: ['./ui-value-swiper.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, SwiperDirective],
})
export class UiValueSwiperComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input()
  data: ValueCards[] = [];

  activeIndex = -1;

  @Input()
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
      320: {
        enabled: false,
        direction: 'vertical',
        slidesPerView: 'auto',
        spaceBetween: 12,
      },
    },
  };
}
