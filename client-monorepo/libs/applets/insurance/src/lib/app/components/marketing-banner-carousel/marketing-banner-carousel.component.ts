import { Component, input } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import {
  CarouselBanner
} from '../../features/vehicle/data-access/models/third-party/carousel-banner/carousel-banner.model';

@Component({
  selector: 'marketing-banner-carousel',
  standalone: true,
  imports: [
    NgClass,
    NgOptimizedImage,
    CarouselModule
  ],
  templateUrl: './marketing-banner-carousel.component.html',
  styleUrl: './marketing-banner-carousel.component.scss'
})
export class MarketingBannerCarouselComponent {

  banners = input<CarouselBanner[]>([]);

  options: OwlOptions = {
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    margin: 16,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    rtl: true
  };

  constructor() {
  }
}
