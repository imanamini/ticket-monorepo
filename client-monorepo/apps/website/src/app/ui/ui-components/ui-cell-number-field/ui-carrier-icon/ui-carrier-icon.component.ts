import { Component, Input } from '@angular/core';
import { OperatorIds } from '../../../../api/digipay/models/carrier/operator-ids';
import { NgStyle, NgClass } from '@angular/common';

@Component({
  selector: 'app-ui-carrier-icon',
  templateUrl: './ui-carrier-icon.component.html',
  styleUrls: ['./ui-carrier-icon.component.scss'],
  standalone: true,
  imports: [NgStyle, NgClass],
})
export class UiCarrierIconComponent {
  @Input()
  carrier: OperatorIds;

  @Input()
  size = 32;

  @Input()
  round = false;

  // tslint:disable-next-line:typedef
  get operatorIds() {
    return OperatorIds;
  }
}
