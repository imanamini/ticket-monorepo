import { Component, Input } from '@angular/core';
import { ValueCards } from '../../../models/value/value-cards';
import { SwiperOptions } from 'swiper/types';
import { UiValueSwiperComponent } from '../ui-value-swiper/ui-value-swiper.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-value-section',
  templateUrl: './ui-value-section.component.html',
  styleUrls: ['./ui-value-section.component.scss'],
  standalone: true,
  imports: [NgIf, UiValueSwiperComponent],
})
export class UiValueSectionComponent {
  @Input()
  data: ValueCards[] = [];

  @Input()
  title = '';

  @Input()
  subtitle = '';

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
