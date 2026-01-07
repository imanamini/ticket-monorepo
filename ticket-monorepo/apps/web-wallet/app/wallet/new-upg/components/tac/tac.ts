import { UpgStrategy } from '../../models/upg-strategy.interface';
import { TacComponent } from './tac.component';
import { FactoryService } from '../../services/factory.service';
import { inject } from '@angular/core';

export class Tac implements UpgStrategy {
  factoryService = inject(FactoryService);

  implement(): void {
    this.factoryService.createComponent(TacComponent);
  }

}
