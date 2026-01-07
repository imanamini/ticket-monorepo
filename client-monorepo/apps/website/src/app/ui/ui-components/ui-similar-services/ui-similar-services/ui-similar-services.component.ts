import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { SimilarService } from '../../../../api/clients/models/templates/services/similar-services';
import { SwiperContainer } from 'swiper/swiper-element';
import { NgClass, NgIf, NgFor, NgStyle, NgOptimizedImage } from '@angular/common';
import { SwiperDirective } from '../../../ui-directive/swiper.directive';

@Component({
  selector: 'app-ui-similar-services',
  templateUrl: './ui-similar-services.component.html',
  styleUrls: ['./ui-similar-services.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgFor, NgStyle, NgOptimizedImage, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiSimilarServicesComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;
  @Input()
  data!: SimilarService;

  @Input()
  type: 'DEFAULT' | 'GUIDE' = 'DEFAULT';

  @Input()
  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    loop: false,
    slideToClickedSlide: true,
    breakpoints: {
      1280: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
      744: {
        slidesPerView: 2.3,
        spaceBetween: 16,
      },
      547: {
        slidesPerView: 2.1,
        spaceBetween: 16,
      },
      320: {
        slidesPerView: 1.2,
        spaceBetween: 16,
      },
    },
  };

  @Input() id = '';
}
