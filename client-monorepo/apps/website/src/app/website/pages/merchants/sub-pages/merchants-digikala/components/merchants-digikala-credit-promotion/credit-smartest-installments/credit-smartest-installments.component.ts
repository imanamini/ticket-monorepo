import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { SmartestInstallments } from '../../../../../../../../api/clients/models/templates/merchants-digikala/merchants-digikala-template-data';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiButtonComponent } from '../../../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgFor, NgStyle, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../../../../../../ui/ui-directive/swiper.directive';

@Component({
  selector: 'app-credit-smartest-installments',
  templateUrl: './credit-smartest-installments.component.html',
  styleUrls: ['./credit-smartest-installments.component.scss'],
  standalone: true,
  imports: [NgFor, NgStyle, NgIf, UiButtonComponent, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreditSmartestInstallmentsComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input()
  smartestInstallmentData: SmartestInstallments;
  index = 0;

  swiperConfig: SwiperOptions = {
    slidesPerView: 'auto',
    updateOnWindowResize: true,
    spaceBetween: 24,
    loop: true,
  };
}
