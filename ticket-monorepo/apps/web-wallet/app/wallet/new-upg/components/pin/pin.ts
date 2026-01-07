import { UpgStrategy } from '../../models/upg-strategy.interface';
import { inject } from '@angular/core';
import { FactoryService } from '../../services/factory.service';
import { PinComponent } from './pin.component';

export class Pin implements UpgStrategy{
  factoryService = inject(FactoryService);

  implement(): void {
    this.factoryService.createComponent(PinComponent);
  }

}
