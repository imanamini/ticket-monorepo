import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { currencyFormat } from '@digipay/strings';
import { Subscription } from 'rxjs';
import { PersianTime } from '../../../../../../util/persian-time';
import { PersianTimeModel } from '../../../../models/persian-date.model';
import { LayoutService } from '../../../../../../data-access/services/layout.service';
import { ScreenSizeEnum } from '../../../../enums/screen-size.enum';
import { FakeButtonApiService } from '../fake-buttons/services/fake-button-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { SuccessPaymentResultComponent } from './partials/success-payment-result/success-payment-result.component';
import { NgIf } from '@angular/common';
import { FailedPaymentResultComponent } from './partials/failed-payment-result/failed-payment-result.component';
import { PaymentResultModel } from '../../../../api/models/lead/payment-result.model';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.scss'],
  imports: [
    SuccessPaymentResultComponent,
    NgIf,
    FailedPaymentResultComponent
  ],
  standalone: true
})
export class PaymentResultComponent implements OnInit, OnDestroy {
  @ViewChild('copyItem', {static: false})

    // Subscriptions
  subscriptions: Subscription[] = [];

  // Vars
  copyItem: ElementRef<HTMLElement>;
  percent = 0;
  resultList: any[] = [];
  ERROR_RESULT_TRANSLATOR = {
    amount: 'مبلغ (ریال)',
    payDate: 'زمان',
    trackingCode: 'کد رهگیری'
  };
  SUCCESS_RESULT_TRANSLATOR = {
    policyNumber: 'شماره بیمه نامه:',
    payDate: 'تاریخ خرید',
    endPolicyDate: 'پایان اعتبار'
  };
  result: PaymentResultModel;
  size: ScreenSizeEnum;

  constructor(
    private layoutService: LayoutService,
    private fakeButtonApiService: FakeButtonApiService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.subscriptions[0] = this.layoutService.screenSizeChanged
      .subscribe({
        next: (res) => {
          this.size = res;
        }
      });
    this.subscriptions[1] = this.route.queryParams
      .subscribe({
        next: ({providerId}) => {
          if (providerId !== '0') {
            this.fakeButtonApiService.paymentResult(providerId)
              .subscribe({
                next: (response) => {
                  this.result = response.data;
                  response.data.paymentSuccess ? this.createSuccessResult() : this.createErrorResult();
                }, error: (error) => {
                  this.messageService.showErrorIfExists(error);
                }
              });
          } else {
            this.createErrorResult();
          }
        }
      });
  }

  createErrorResult(): void {
    for (const res in this.ERROR_RESULT_TRANSLATOR) {
      if (res === 'payDate') {
        this.result[res] = new PersianTime(this.result[res]).convert(PersianTimeModel.YYYY_MD_HM).toString();
      }
      if (res === 'amount') {
        this.result[res] = currencyFormat(this.result[res]);
      }
      this.resultList.push({
        title: this.ERROR_RESULT_TRANSLATOR[res],
        value: this.result[res],
        clickable: res === 'trackingCode',
        engName: res
      });
    }
  }

  createSuccessResult(): void {
    for (const res in this.SUCCESS_RESULT_TRANSLATOR) {
      if (res === 'payDate' || res === 'endPolicyDate') {
        this.result[res] = new PersianTime(this.result[res]).convert(PersianTimeModel.YYYY_MD_HM).toString();
      }
      this.resultList.push({
        title: this.SUCCESS_RESULT_TRANSLATOR[res],
        value: this.result[res]
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach((s) => s && s.unsubscribe());
  }
}
