import {PageEnum} from "../../../enums/page.enum";
import {inject} from "@angular/core";
import {FactoryService} from "../../../services/factory.service";
import {UpgStrategy} from "../../../models/upg-strategy.interface";
import {CAndPValidAmountComponent} from "./c-and-p-valid-amount.component";

export class CAndPValidAmount implements UpgStrategy {
  private factoryService = inject(FactoryService);

  public implement(): void {
    this.factoryService.createComponent(CAndPValidAmountComponent);
  }
}
