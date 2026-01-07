import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store, StorePaymentMethod, StoreType } from '@client-monorepo/stores';
import { Router } from '@angular/router';
import { AccordionStateService, AccordionWithIsOpen } from '@digipay/ngx-accordion';
import { ButtonIcon, NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'stores-applet-store-intro',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './store-intro.component.html',
  styleUrl: './store-intro.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreIntroComponent implements AccordionWithIsOpen {
  accordionStateService = inject(AccordionStateService);
  router = inject(Router);
  store = input.required<Store>();
  isOpen = input<boolean>(false);
  componentId = input<string>('');
  shoppingGuideIcon: ButtonIcon = { name: 'question-mark-circle' };

  goToShoppingGuide(): void {
    const paymentMethods = [];
    if (this.store()?.types?.includes(StoreType.ONLINE)) {
      paymentMethods.push('online');
    }
    if (this.store()?.types?.includes(StoreType.ONSITE)) {
      paymentMethods.push('onsite');
    }
    if (this.store()?.paymentMethods?.includes(StorePaymentMethod.QR_CODE)) {
      paymentMethods.push('qr');
    }

    this.router.navigate(['/stores/shopping-guide'], { queryParams: { methods: paymentMethods } });
  }
}
