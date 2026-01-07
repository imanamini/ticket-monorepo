import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AboutUsTemplateData } from '../../../../api/clients/models/templates/about-us/about-us-template-data';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgFor, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../../ui/ui-directive/swiper.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-us-membership',
  templateUrl: './about-us-membership.component.html',
  styleUrls: ['./about-us-membership.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, UiButtonComponent, SwiperDirective, RouterLink],
})
export class AboutUsMembershipComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input()
  templateData: AboutUsTemplateData | null = null;

  config: SwiperOptions = {
    centeredSlides: true,
    slidesPerView: 1,
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
    loop: true,
    breakpoints: {
      1200: {
        slidesPerView: 3,
      },
      992: {
        slidesPerView: 2,
      },
      768: {
        spaceBetween: 30,
        slidesPerView: 2,
      },
      576: {
        slidesPerView: 1,
      },
      320: {
        slidesPerView: 1,
      },
    },
  };
}
