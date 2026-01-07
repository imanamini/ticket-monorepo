import { UpgStrategy } from '../../models/upg-strategy.interface';
import {Inject, inject} from '@angular/core';
import { FactoryService } from '../../services/factory.service';
import { WalletPayComponent } from './wallet-pay.component';

export class WalletPay implements UpgStrategy {
  factoryService = inject(FactoryService);

  implement(): void {
    this.factoryService.createComponent(WalletPayComponent);
  }
}
