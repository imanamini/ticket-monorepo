import { PaymentMethodComponent } from './payment-method.component';
import { inject } from '@angular/core';
import { FactoryService } from '../../data-access/services/factory.service';
import { UpgStrategy } from '../../data-access/models/upg-strategy.interface';

export class PaymentMethod implements UpgStrategy {
  factoryService = inject(FactoryService);

  implement(): void {
    this.factoryService.createComponent(PaymentMethodComponent);
  }
}
