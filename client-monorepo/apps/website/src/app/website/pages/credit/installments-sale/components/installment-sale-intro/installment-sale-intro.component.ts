import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, Inject, Input, PLATFORM_ID, ViewChild } from '@angular/core';
import { ApiFile } from '../../../../../../api/clients/models/common/api-file';
// import SwiperCore, { Autoplay } from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { CurrencyPipe } from '../../../../../../ui/ui-pipes/currency.pipe';
import { ScrollToAnchorDirective } from '../../../../../../ui/ui-directive/scroll-to-anchor.directive';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgFor } from '@angular/common';
import { SwiperDirective } from '../../../../../../ui/ui-directive/swiper.directive';

// SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-installment-sale-intro',
  templateUrl: './installment-sale-intro.component.html',
  styleUrls: ['./installment-sale-intro.component.scss'],
  standalone: true,
  imports: [NgFor, UiButtonComponent, ScrollToAnchorDirective, CurrencyPipe, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InstallmentSaleIntroComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input() images: Array<{ image: ApiFile }>;
  @Input() values: Array<{ value: string }>;

  endFixedButton = false;
  index = 0;

  config: SwiperOptions = {
    centeredSlides: true,
    slidesPerView: 1,
    allowTouchMove: false,
    loop: true,
    autoplay: {
      delay: 3000,
    },
  };

  constructor(@Inject(PLATFORM_ID) public platformId: string) {}

  @HostListener('window:scroll', []) // for window scroll events
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementsByClassName('section-credit-calculator-based-on-basket-amount')[0];
      const elPosition = el.getBoundingClientRect();
      this.endFixedButton = elPosition.top <= window.innerHeight && elPosition.bottom >= 0;
    }
  }
}
