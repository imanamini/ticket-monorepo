import { Component, Input } from '@angular/core';
import { HomeCustomerDefinition } from '../../../../api/clients/models/templates/home/home-data.response';
import { CarouselConfig } from '../../../../ui/ui-components/ui-carousel/ui-carousel/carousel-config';
import { UiCarouselComponent } from '../../../../ui/ui-components/ui-carousel/ui-carousel/ui-carousel.component';
import { NgIf, NgClass } from '@angular/common';

// SwiperCore.use([Navigation, Autoplay]);

@Component({
  selector: 'app-home-customers',
  templateUrl: './home-customers.component.html',
  styleUrls: ['./home-customers.component.scss'],
  standalone: true,
  imports: [NgIf, UiCarouselComponent, NgClass],
})
export class HomeCustomersComponent {
  @Input()
  customers?: HomeCustomerDefinition;
  @Input() merchantRegister = false;
  @Input() autoplay = false;

  config: CarouselConfig = {
    slidesPerView: 7,
    loop: true,
    hasCustomPagination: false,
    gap: 0,
    breakpoints: {
      650: {
        slidesPerView: 5,
      },
      320: {
        slidesPerView: 3,
      },
    },
  };
}
