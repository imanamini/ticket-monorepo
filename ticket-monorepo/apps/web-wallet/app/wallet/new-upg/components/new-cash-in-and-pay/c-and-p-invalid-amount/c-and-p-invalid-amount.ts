import {inject} from "@angular/core";
import {FactoryService} from "../../../services/factory.service";
import {UpgStrategy} from "../../../models/upg-strategy.interface";
import {CAndPInvalidAmountComponent} from "./c-and-p-invalid-amount.component";

export class CAndPInValidAmount implements UpgStrategy {
  private factoryService = inject(FactoryService);

  public implement(): void {
    this.factoryService.createComponent(CAndPInvalidAmountComponent);
  }
}
