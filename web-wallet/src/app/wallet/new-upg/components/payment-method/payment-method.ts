import { UpgStrategy } from '../../models/upg-strategy.interface';
import { FactoryService } from '../../services/factory.service';
import { PaymentMethodComponent } from './payment-method.component';
import { inject } from '@angular/core';

export class PaymentMethod implements UpgStrategy {
  factoryService = inject(FactoryService);

  implement(): void {
    this.factoryService.createComponent(PaymentMethodComponent);
  }

}
