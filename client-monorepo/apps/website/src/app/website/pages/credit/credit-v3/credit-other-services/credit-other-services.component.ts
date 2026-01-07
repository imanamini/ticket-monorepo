import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { OtherServices } from '../../../../../api/clients/models/templates/credit-v3/credit-config.response';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { NgIf, NgFor, NgStyle } from '@angular/common';
import { SwiperDirective } from '../../../../../ui/ui-directive/swiper.directive';

@Component({
  selector: 'app-credit-other-services',
  templateUrl: './credit-other-services.component.html',
  styleUrls: ['./credit-other-services.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreditOtherServicesComponent implements AfterViewInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input()
  creditOtherServicesData!: OtherServices;

  index = 0;

  config: SwiperOptions = {
    slidesPerView: 'auto',
    allowTouchMove: true,
    loop: false,
    spaceBetween: 24,
    breakpoints: {
      1280: {
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
