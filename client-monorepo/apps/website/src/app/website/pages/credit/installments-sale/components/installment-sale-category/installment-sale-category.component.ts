import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { NgFor, NgStyle } from '@angular/common';
import { SwiperDirective } from '../../../../../../ui/ui-directive/swiper.directive';

@Component({
  selector: 'app-installment-sale-category',
  templateUrl: './installment-sale-category.component.html',
  styleUrls: ['./installment-sale-category.component.scss'],
  standalone: true,
  imports: [NgFor, NgStyle, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InstallmentSaleCategoryComponent implements AfterViewInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input() data: any;
  index = 0;

  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
    slideToClickedSlide: false,
    spaceBetween: 16,
    grabCursor: true,
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

  slideChange(swiper: any) {
    this.index = swiper.detail[0].activeIndex;
  }

  ngAfterViewInit() {
    this.swiper.nativeElement.swiper.activeIndex = this.index;
  }
}
