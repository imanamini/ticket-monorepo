import { Component, Input } from '@angular/core';

@Component({
  selector: 'amount-info',
  templateUrl: './amount-info.component.html',
  styleUrls: ['./amount-info.component.scss']
})
export class AmountInfoComponent {
  @Input() cashoutableBalance: number;
  @Input() maxAmount: number;
  public showToolTip = false;
}
