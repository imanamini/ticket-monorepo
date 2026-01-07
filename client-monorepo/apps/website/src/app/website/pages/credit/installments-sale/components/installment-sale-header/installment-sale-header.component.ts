import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {ScrollToAnchorDirective} from '../../../../../../ui/ui-directive/scroll-to-anchor.directive';
import {isPlatformBrowser, NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-installment-sale-header',
  templateUrl: './installment-sale-header.component.html',
  styleUrls: ['./installment-sale-header.component.scss'],
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, ScrollToAnchorDirective],
})
export class InstallmentSaleHeaderComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: string) {
  }

  openDigikalaCheque() {

    if (isPlatformBrowser(this.platformId)) {
      window.location.href = 'https://digikala.com/cheque/';
    }

  }
}
