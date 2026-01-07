import { Component, Input } from '@angular/core';
import { TicketInfoResponse } from '../../../api/models/ticket-info.response';
import { TacResponse } from '../../../api/models/tac.response';

@Component({
  selector: 'ui-purchase-info',
  templateUrl: './ui-purchase-info.component.html',
  styleUrls: ['./ui-purchase-info.component.scss']
})
export class UiPurchaseInfoComponent {

  @Input()
  purchaseInfo: TicketInfoResponse;

  @Input()
  tacResponse: TacResponse;

  @Input()
  sufficientBalance: boolean;

  @Input()
  forcedPurchaseAmount = 0;
}
