import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TimePersianUnit, NumberPersianText } from '../../../wallet/wallet-subscription/wallet-subscription.constants';
import { SubscriptionGroupResponse } from '../../../api/models/subscription-groups.response';
import { SubscriptionContractResponse } from '../../../api/models/subscription-contracts.response';

@Component({
  selector: 'ui-template-card',
  templateUrl: './ui-template-card.component.html',
  styleUrls: ['./ui-template-card.component.scss']
})
export class UiTemplateCardComponent implements OnInit {
  @Input()
  id: { cancel: string };

  @Input()
  cancellationTime: number | string;

  @Input()
  cardData: SubscriptionGroupResponse | SubscriptionContractResponse;

  @Input()
  cardTitle: string;

  @Input()
  cardAmountPrefix: string;

  @Input()
  cardAmount: string | number;

  @Input()
  trialDuration: any;

  @Input()
  hasCancelAction = false;

  @Input()
  firstField;

  @Input()
  secondField;

  @Input()
  thirdField;

  @Input()
  imageId: string;

  @Output()
  cancel = new EventEmitter();

  timePersianUnit: {};

  numberPersianText: {};

  ngOnInit() {
    this.timePersianUnit = TimePersianUnit;
    this.numberPersianText = NumberPersianText;
  }

  getValidityDuration() {
    return (this.numberPersianText[this.cardData.validityDuration.count] ||
        this.cardData.validityDuration.count) + ' ' +
      this.timePersianUnit[this.cardData.validityDuration.timeUnit].persianUnit;
  }

  getPaymentPeriodDuration() {
    return (this.numberPersianText[this.cardData.paymentPeriodDuration.count] ||
        this.cardData.paymentPeriodDuration.count) + ' ' +
      this.timePersianUnit[this.cardData.paymentPeriodDuration.timeUnit].persianUnit;
  }

  getTrialDuration() {
    return this.cardData.trialDuration.count + ' ' +
      this.timePersianUnit[this.cardData.trialDuration.timeUnit].persianUnit +
      ' دوره آزمایشی';
  }

  cancelClicked() {
    this.cancel.emit();
  }
}
