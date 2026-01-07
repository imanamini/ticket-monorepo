import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ContactUsTemplate } from '../../../../api/clients/models/templates/contact-us/contact-us-template';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { NgFor, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../../ui/ui-directive/swiper.directive';

@Component({
  selector: 'app-contact-us-intro',
  templateUrl: './contact-us-intro.component.html',
  styleUrls: ['./contact-us-intro.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, SwiperDirective],
})
export class ContactUsIntroComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input()
  templateData: ContactUsTemplate | any = {};
  index = 0;

  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    spaceBetween: 24,
    speed: 700,
    breakpoints: {
      1280: {
        slidesPerView: 5,
        spaceBetween: 24,
      },
      744: {
        slidesPerView: 3,
      },
      280: {
        slidesPerView: 2,
        spaceBetween: 5,
      },
    },
  };
}
