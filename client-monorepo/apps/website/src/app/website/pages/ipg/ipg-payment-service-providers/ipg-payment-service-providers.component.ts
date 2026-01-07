import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { IpgTemplateData } from '../../../../api/clients/models/templates/ipg/ipg-template-data';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { NgFor, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../../ui/ui-directive/swiper.directive';

@Component({
  selector: 'app-ipg-payment-service-providers',
  templateUrl: './ipg-payment-service-providers.component.html',
  styleUrls: ['./ipg-payment-service-providers.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, SwiperDirective],
})
export class IpgPaymentServiceProvidersComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;

  @Input()
  templateData: IpgTemplateData | null = null;



  config: SwiperOptions = {
    slidesPerView: 6,
    roundLengths: true,
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
    freeMode: true,
  };

}
