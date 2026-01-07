import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { IpgTemplateData } from '../../../../api/clients/models/templates/ipg/ipg-template-data';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { NgFor, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../../ui/ui-directive/swiper.directive';

@Component({
  selector: 'app-ipg-our-customers',
  templateUrl: './ipg-our-customers.component.html',
  styleUrls: ['./ipg-our-customers.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IpgOurCustomersComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input()
  templateData: IpgTemplateData | null = null;

  config: SwiperOptions = {
    slidesPerView: 3,
    roundLengths: true,
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
    loop: true,
    freeMode: true,
  };
}
