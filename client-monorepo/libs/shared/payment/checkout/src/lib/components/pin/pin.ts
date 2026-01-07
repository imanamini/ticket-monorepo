import { inject } from '@angular/core';
import { FactoryService } from '../../data-access/services/factory.service';
import { UpgStrategy } from '../../data-access/models/upg-strategy.interface';
import { PaymentCheckoutPinComponent } from './checkout-pin.component';

export class Pin implements UpgStrategy {
  factoryService = inject(FactoryService);

  implement(): void {
    this.factoryService.createComponent(PaymentCheckoutPinComponent, { notCloseOnChangeRoute: true });
  }
}
