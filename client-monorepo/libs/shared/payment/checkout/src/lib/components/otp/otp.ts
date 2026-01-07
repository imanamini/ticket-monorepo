import { inject } from '@angular/core';
import { UpgStrategy } from '../../data-access/models/upg-strategy.interface';
import { FactoryService } from '../../data-access/services/factory.service';
import { CheckoutOtpComponent } from './checkout-otp.component';

export class Otp implements UpgStrategy {
  private factoryService = inject(FactoryService);

  implement(): void {
    this.factoryService.createComponent(CheckoutOtpComponent);
  }
}
