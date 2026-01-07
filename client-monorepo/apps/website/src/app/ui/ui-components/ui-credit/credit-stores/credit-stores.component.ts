import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { CreditMerchants } from '../../../../api/clients/models/templates/credit-v3/credit-config.response';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { UiMerchantCardComponent } from '../../ui-merchant-card/ui-merchant-card.component';
import { NgFor, NgIf } from '@angular/common';
import { UiIconDirective } from '../../../ui-directive/ui-icon.directive';
import { SwiperDirective } from '../../../ui-directive/swiper.directive';
import { NgxIcon } from '@digipay/ngx-icon';

// SwiperCore.use([Navigation]);

@Component({
  selector: 'app-credit-stores',
  templateUrl: './credit-stores.component.html',
  styleUrls: ['./credit-stores.component.scss'],
  standalone: true,
  imports: [NgIf, UiIconDirective, NgFor, UiMerchantCardComponent, UiButtonComponent, UiIconDirective, SwiperDirective, NgxIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreditStoresComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;

  @Input()
  creditStores: CreditMerchants;

  config: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 20,
    allowTouchMove: true,
    centerInsufficientSlides: true,
    slideToClickedSlide: true,
    updateOnWindowResize: true,
    watchSlidesProgress: true,
    loop: true,
    breakpoints: {
      1280: {
        slidesPerView: 3,
      },
      744: {
        slidesPerView: 1.7,
      },
      20: {
        slidesPerView: 'auto',
      },
    },
  };
}
