import { UpgStrategy } from '../../models/upg-strategy.interface';
import { inject } from '@angular/core';
import { FactoryService } from '../../services/factory.service';
import { CashInAndPayComponent } from './cash-in-and-pay.component';

export class CashInAndPay implements UpgStrategy{
  private factoryService = inject(FactoryService);

  implement(): void {
    this.factoryService.createComponent(CashInAndPayComponent);
  }

}
