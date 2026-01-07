import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { RenewHomeWithInstallments } from '../../../../../../../../api/clients/models/templates/merchants-digikala/merchants-digikala-template-data';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiButtonComponent } from '../../../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgFor, NgStyle, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../../../../../../ui/ui-directive/swiper.directive';

@Component({
  selector: 'app-credit-renew-home-with-installments',
  templateUrl: './credit-renew-home-with-installments.component.html',
  styleUrls: ['./credit-renew-home-with-installments.scss'],
  standalone: true,
  imports: [NgFor, NgStyle, NgIf, UiButtonComponent, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreditRenewHomeWithInstallmentsComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input()
  renewHomeWithInstallmentsData: RenewHomeWithInstallments;

  index = 0;

  swiperConfig: SwiperOptions = {
    slidesPerView: 'auto',
    updateOnWindowResize: true,
    spaceBetween: 16,
    loop: true,
  };
}
