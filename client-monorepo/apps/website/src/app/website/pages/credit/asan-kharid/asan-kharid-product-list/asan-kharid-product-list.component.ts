import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { AsanKharidTemplateData } from '../../../../../api/clients/models/templates/asan-kharid/asan-kharid-template-data';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { NgFor, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../../../ui/ui-directive/swiper.directive';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-asan-kharid-product-list',
  templateUrl: './asan-kharid-product-list.component.html',
  styleUrls: ['./asan-kharid-product-list.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AsanKharidProductListComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;

  @Input()
  templateData: AsanKharidTemplateData | null = null;

  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
    slideToClickedSlide: false,
    loop: true,
    breakpoints: {
      1280: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      744: {
        spaceBetween: 20,
        slidesPerView: 2.5,
      },
      280: {
        slidesPerView: 1.2,
        spaceBetween: 15,
      },
    },
  };
}
