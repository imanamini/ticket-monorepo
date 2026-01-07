import { UpgStrategy } from '../../models/upg-strategy.interface';
import { inject } from '@angular/core';
import { FactoryService } from '../../services/factory.service';
import { RedirectCashInComponent } from './redirect-cash-in.component';

export class CashInRedirect implements UpgStrategy {
  private factoryService = inject(FactoryService);

  public implement(): void {
    this.factoryService.createComponent(RedirectCashInComponent);
  }
}
