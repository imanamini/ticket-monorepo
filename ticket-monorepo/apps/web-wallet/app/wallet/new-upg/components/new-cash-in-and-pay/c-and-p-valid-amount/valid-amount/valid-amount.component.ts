import {Component, Input, OnInit} from '@angular/core';
import {TgsSelectFeatureResponse} from "../../../../../../api/models/tgs-select-feature-response";
import {TomanConvertor} from "../../../../utils/toman-convertor";

@Component({
  selector: 'app-valid-amount',
  templateUrl: './valid-amount.component.html',
  styleUrls: ['./valid-amount.component.scss']
})
export class ValidAmountComponent implements OnInit {
  @Input() info: TgsSelectFeatureResponse;
  public tomanAmount: string;

  ngOnInit() {
    this.convertAmountCurrency();
  }

  private convertAmountCurrency(): void {
    this.tomanAmount = TomanConvertor(this.info.cashInAmount);
  }
}
