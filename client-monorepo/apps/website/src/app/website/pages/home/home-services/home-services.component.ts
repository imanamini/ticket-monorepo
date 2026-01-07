import { Component, Input } from '@angular/core';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { HomeMainService } from '../../../../api/clients/models/templates/home/home-data.response';
import { CarouselConfig } from '../../../../ui/ui-components/ui-carousel/ui-carousel/carousel-config';
import { UiCarouselComponent } from '../../../../ui/ui-components/ui-carousel/ui-carousel/ui-carousel.component';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-home-services',
  templateUrl: './home-services.component.html',
  styleUrls: ['./home-services.component.scss'],
  standalone: true,
  imports: [NgIf, UiCarouselComponent, NgClass],
})
export class HomeServicesComponent {
  @Input()
  services: HomeMainService[] = [];

  @Input()
  loaded = false;

  config: CarouselConfig = {
    centerSlides: false,
    loop: true,
    hasAutoPlay: false,
    autoplayDelay: 4000,
    gap: 10,
    rtl: true,
    autoWidth: true,
    autoHeight: false,
    breakpoints: {
      1200: {
        slidesPerView: 5,
        gap: 30,
      },
      650: {
        slidesPerView: 3,
        gap: 30,
      },
      200: {
        slidesPerView: 3,
        gap: 15,
      },
    },
  };

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    rtl: true,
    navSpeed: 700,
    autoplay: true,
    navText: ['', ''],
    center: true,
    autoWidth: false,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 3,
      },
      940: {
        items: 5,
      },
    },
    nav: false,
  };

  centerPos: number | undefined = 0;

  carouselChanged($event: SlidesOutputData) {
    this.centerPos = $event.startPosition;
  }
}
