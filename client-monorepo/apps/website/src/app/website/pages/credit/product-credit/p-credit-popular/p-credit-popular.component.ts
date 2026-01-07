import { Component, Input } from '@angular/core';
import { CreditProductPageTemplate } from '../../../../../api/clients/models/templates/credit/credit-product-page.response';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-p-credit-popular',
  templateUrl: './p-credit-popular.component.html',
  styleUrls: ['./p-credit-popular.component.scss'],
  standalone: true,
  imports: [NgIf, CarouselModule, NgFor],
})
export class PCreditPopularComponent {
  @Input()
  templateData: CreditProductPageTemplate | null = null;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    rtl: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    autoWidth: true,
    margin: 16,
    nav: false,
    responsive: {
      0: {
        items: 2.2,
      },
      400: {
        items: 3.2,
      },
      700: {
        items: 4.2,
      },
      900: {
        items: 6.2,
      },
    },
  };
}
