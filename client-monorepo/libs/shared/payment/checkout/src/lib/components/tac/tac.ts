import { TacComponent } from './tac.component';
import { inject } from '@angular/core';
import { UpgStrategy } from '../../data-access/models/upg-strategy.interface';
import { FactoryService } from '../../data-access/services/factory.service';

export class Tac implements UpgStrategy {
  factoryService = inject(FactoryService);

  implement(): void {
    this.factoryService.createComponent(TacComponent);
  }
}
