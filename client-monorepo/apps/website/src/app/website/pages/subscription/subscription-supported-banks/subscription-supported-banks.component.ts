import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { SubscriptionTemplateData } from '../../../../api/clients/models/templates/subscription/subscription-template-data';
import { SwiperContainer } from 'swiper/swiper-element';
import { NgFor, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../../ui/ui-directive/swiper.directive';

// SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-subscription-supported-banks',
  templateUrl: './subscription-supported-banks.component.html',
  styleUrls: ['./subscription-supported-banks.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SubscriptionSupportedBanksComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;

  @Input()
  templateData: SubscriptionTemplateData | null = null;

  config: SwiperOptions = {
    slidesPerView: 'auto',
    loop: true,
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
    breakpoints: {
      1200: {
        slidesPerView: 6,
        spaceBetween: 0,
      },
      557: {
        slidesPerView: 4,
        spaceBetween: 0,
      },
      320: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
    },
  };
}
