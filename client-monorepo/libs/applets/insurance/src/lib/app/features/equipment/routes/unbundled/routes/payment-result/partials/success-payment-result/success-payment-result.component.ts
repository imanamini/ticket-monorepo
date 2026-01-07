import { Component, Input } from '@angular/core';

import { TipsComponent } from '../tips/tips.component';
import { UiButtonComponent } from '../../../../../../../../components/ui-button/ui-button/ui-button.component';
import {
  InsurtechCollectionImageCdnComponent
} from '../../../../../../../../components/insurtech-collection-image-cdn/insurtech-collection-image-cdn.component';
import { PaymentResultModel } from '../../../../../../api/models/lead/payment-result.model';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'success-payment-result',
  templateUrl: './success-payment-result.component.html',
  styleUrls: ['./success-payment-result.component.scss'],
  imports: [
    TipsComponent,
    UiButtonComponent,
    InsurtechCollectionImageCdnComponent,
    NgForOf
  ],
  standalone: true
})
export class SuccessPaymentResultComponent {

  @Input()
  result: PaymentResultModel;

  @Input()
  resultList: any[] = [];

  constructor() {
  }

}
