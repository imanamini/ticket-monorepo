import {inject} from '@angular/core';
import {CPOtpComponent} from "./c-p-otp.component";
import {UpgStrategy} from "../../../models/upg-strategy.interface";
import {FactoryService} from "../../../services/factory.service";

export class CPOtp implements UpgStrategy {
  private factoryService = inject(FactoryService);

  implement(): void {
    this.factoryService.createComponent(CPOtpComponent);
  }
}
