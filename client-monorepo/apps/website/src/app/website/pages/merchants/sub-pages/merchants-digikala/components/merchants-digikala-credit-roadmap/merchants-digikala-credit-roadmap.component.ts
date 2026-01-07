import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { MerchantsDigikalaCreditRoadmap } from '../../../../../../../api/clients/models/templates/merchants-digikala/merchants-digikala-template-data';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/element';
import { UiButtonComponent } from '../../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgIf, NgFor, NgOptimizedImage, NgClass } from '@angular/common';
import { UiIconDirective } from '../../../../../../../ui/ui-directive/ui-icon.directive';
import { SwiperDirective } from '../../../../../../../ui/ui-directive/swiper.directive';

// Swiper.use([Navigation, Pagination]);

@Component({
  selector: 'app-merchants-digikala-credit-roadmap',
  templateUrl: './merchants-digikala-credit-roadmap.component.html',
  styleUrls: ['./merchants-digikala-credit-roadmap.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgOptimizedImage, NgClass, UiIconDirective, UiButtonComponent, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MerchantsDigikalaCreditRoadmapComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input()
  creditRoadmapData: MerchantsDigikalaCreditRoadmap;

  swiperConfig: SwiperOptions = {
    pagination: {
      el: '.swiper-pagination',
    },
    breakpoints: {
      1280: {
        slidesPerView: 3,
      },
      744: {
        slidesPerView: 1.5,
      },
      320: {
        slidesPerView: 'auto',
      },
    },
  };
  index = 0;
}
