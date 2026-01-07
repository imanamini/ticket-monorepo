import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BlogCategory } from '../../../../api/clients/models/content/blog-post';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/element';
import { NgIf, NgFor } from '@angular/common';
import { SwiperDirective } from '../../../ui-directive/swiper.directive';

@Component({
  selector: 'app-ui-blog-children-swiper',
  templateUrl: './ui-blog-children-swiper.component.html',
  styleUrls: ['./ui-blog-children-swiper.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, SwiperDirective],
})
export class UiBlogChildrenSwiperComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input()
  categories: BlogCategory[];

  index = 0;

  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    slideToClickedSlide: true,
    navigation: true,
    slidesPerView: 'auto',
    slideNextClass: 'swiper-slide-next',
    slidePrevClass: 'swiper-slide-prev',
    loop: false,
    breakpoints: {
      400: {
        spaceBetween: 40,
      },
      10: {
        spaceBetween: 24,
      },
    },
  };
}
