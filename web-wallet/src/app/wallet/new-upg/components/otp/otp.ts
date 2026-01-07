import { UpgStrategy } from '../../models/upg-strategy.interface';
import { inject } from '@angular/core';
import { FactoryService } from '../../services/factory.service';
import { OtpComponent } from './otp.component';

export class Otp implements UpgStrategy{
  private factoryService = inject(FactoryService);

  implement(): void {
    this.factoryService.createComponent(OtpComponent);
  }
}
