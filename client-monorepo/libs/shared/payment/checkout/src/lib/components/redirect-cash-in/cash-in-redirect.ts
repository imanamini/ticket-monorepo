import { inject } from '@angular/core';
import { RedirectCashInComponent } from './redirect-cash-in.component';
import { UpgStrategy } from '../../data-access/models/upg-strategy.interface';
import { FactoryService } from '../../data-access/services/factory.service';

export class CashInRedirect implements UpgStrategy {
  private factoryService = inject(FactoryService);

  public implement(): void {
    this.factoryService.createComponent(RedirectCashInComponent);
  }
}
