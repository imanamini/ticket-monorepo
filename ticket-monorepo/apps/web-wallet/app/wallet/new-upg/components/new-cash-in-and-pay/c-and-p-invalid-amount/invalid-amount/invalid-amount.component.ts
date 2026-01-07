import {Component, Input} from '@angular/core';
import {TgsSelectFeatureResponse} from "../../../../../../api/models/tgs-select-feature-response";

@Component({
  selector: 'app-invalid-amount',
  templateUrl: './invalid-amount.component.html',
  styleUrls: ['./invalid-amount.component.scss']
})
export class InvalidAmountComponent {
  @Input() info: TgsSelectFeatureResponse;
}
