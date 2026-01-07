import { inject } from '@angular/core';
import { CashInAndPayComponent } from './cash-in-and-pay.component';
import { UpgStrategy } from '../../data-access/models/upg-strategy.interface';
import { FactoryService } from '../../data-access/services/factory.service';

export class CashInAndPay implements UpgStrategy {
  private factoryService = inject(FactoryService);

  implement(): void {
    this.factoryService.createComponent(CashInAndPayComponent);
  }
}
