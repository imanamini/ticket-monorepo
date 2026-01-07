import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { CreditPromotionTechBestSellers } from '../../../../../../../../api/clients/models/templates/merchants-digikala/merchants-digikala-template-data';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiButtonComponent } from '../../../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgFor, NgStyle, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../../../../../../ui/ui-directive/swiper.directive';

@Component({
  selector: 'app-credit-promotion-tech-best-sellers',
  templateUrl: './credit-promotion-tech-best-sellers.component.html',
  styleUrls: ['./credit-promotion-tech-best-sellers.component.scss'],
  standalone: true,
  imports: [NgFor, NgStyle, NgIf, UiButtonComponent, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreditPromotionTechBestSellersComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input()
  creditPromotionTechBestSellers: CreditPromotionTechBestSellers;

  swiperConfig: SwiperOptions = {
    slidesPerView: 'auto',
    loop: true,
    updateOnWindowResize: true,
    spaceBetween: 16,
  };
  index = 0;
}
