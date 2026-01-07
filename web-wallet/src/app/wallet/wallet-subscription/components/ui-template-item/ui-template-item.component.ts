import { Component, Input, OnInit } from '@angular/core';
import { TimePersianUnit, NumberPersianText } from '../../wallet-subscription.constants';
import { SubscriptionGroupResponse } from '../../../../api/models/subscription-groups.response';

@Component({
  selector: 'ui-template-item',
  templateUrl: './ui-template-item.component.html',
  styleUrls: ['./ui-template-item.component.scss']
})
export class UiTemplateItemComponent implements OnInit {

  @Input()
  cancellationTime: number | string;

  @Input()
  cardData: SubscriptionGroupResponse;

  timePersianUnit: {};
  numberPersianText: {};

  ngOnInit() {
    this.timePersianUnit = TimePersianUnit;
    this.numberPersianText = NumberPersianText;
  }

  getValidityDuration() {
    return this.numberPersianText[this.cardData.validityDuration.count] + ' ' +
      this.timePersianUnit[this.cardData.validityDuration.timeUnit].persianUnit;
  }

  getPaymentPeriodDuration() {
    return this.timePersianUnit[this.cardData.paymentPeriodDuration.timeUnit].persianPeriod;
  }
}
