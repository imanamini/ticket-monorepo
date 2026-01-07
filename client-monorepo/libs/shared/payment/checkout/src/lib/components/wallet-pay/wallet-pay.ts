import { inject } from '@angular/core';
import { WalletPayComponent } from './wallet-pay.component';
import { FactoryService } from '../../data-access/services/factory.service';
import { UpgStrategy } from '../../data-access/models/upg-strategy.interface';

export class WalletPay implements UpgStrategy {
  factoryService = inject(FactoryService);

  implement(): void {
    this.factoryService.createComponent(WalletPayComponent);
  }
}
