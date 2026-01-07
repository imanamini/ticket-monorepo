import {inject} from '@angular/core';
import {UpgStrategy} from "../../../models/upg-strategy.interface";
import {FactoryService} from "../../../services/factory.service";
import {CPPinComponent} from "./c-p-pin.component";

export class CPPin implements UpgStrategy {
  private factoryService = inject(FactoryService);

  implement(): void {
    this.factoryService.createComponent(CPPinComponent);
  }
}
