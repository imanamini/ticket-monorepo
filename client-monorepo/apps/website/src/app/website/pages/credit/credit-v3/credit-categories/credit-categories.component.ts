import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { SectionCreditCategories } from '../../../../../api/clients/models/templates/credit-v3/credit-config.response';
import { SwiperContainer } from 'swiper/swiper-element';
import { NgFor, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../../../ui/ui-directive/swiper.directive';

@Component({
  selector: 'app-credit-categories',
  templateUrl: './credit-categories.component.html',
  styleUrls: ['./credit-categories.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreditCategoriesComponent implements AfterViewInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input()
  creditCategoriesData: SectionCreditCategories;

  config: SwiperOptions = {
    slidesPerView: 'auto',
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    allowTouchMove: true,
    navigation: true,
    spaceBetween: 40,
    slideNextClass: 'swiper-slide-next',
    slidePrevClass: 'swiper-slide-prev',
    loop: false,
  };

  index = 0;

  slideChange(swiper: any) {
    this.index = swiper.detail[0].activeIndex;
  }

  ngAfterViewInit() {
    this.swiper.nativeElement.swiper.activeIndex = this.index;
  }
}
