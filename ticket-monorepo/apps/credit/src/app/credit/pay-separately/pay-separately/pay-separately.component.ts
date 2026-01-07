import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PayStep, PayStepStatus } from '../services/pay-step.interface';
import { ActivatedRoute } from '@angular/router';
import { CreditApiService } from '../../api/credit-api.service';
import { CreditPurchaseSummaryResponse, PurchaseSummaryItem } from '../../api/purchase/credit-purchase-summary.response';
import { StorageService } from '../../core/services/storage.service';
import { ApiResponse } from '../../api/api-response.model';
import { CreditPayService } from '../../shared/services/credit-pay.service';
import { LocationTrap } from '../../credit-ui/location-trap/location-trap';
import { CountdownEvent } from 'ngx-countdown';

interface HiddenFormData extends ApiResponse {
  url: string;
  redirectMethod: 'POST' | 'GET';
  data: string;
}
type MessageStatus = 'disabled' | 'primary' | 'success' | 'danger' | 'warning';
const StepStatusMap: { [key: string]: PayStepStatus } = {
  INITIATED: 'disabled',
  SUCCESS: 'success',
  PENDING: 'primary',
  FAILED: 'danger'
};

@Component({
  selector: 'app-pay-separately',
  templateUrl: './pay-separately.component.html',
  styleUrls: ['./pay-separately.component.scss', '../shared.style.scss']
})
export class PaySeparatelyComponent extends LocationTrap implements OnInit {
  steps: PayStep[];
  message: string;
  messageStatus: MessageStatus;
  countdownTime = 30;
  ticketId: string;
  loading: boolean;
  mainLabel: string;
  currencyLabel: string;
  basketAmount: number;
  buttonLabel: string;
  redirectUrl: string;
  redirectForm: {
    url: string,
    method: 'POST' | 'GET',
    data: {name: string, value: string}[],
  };
  redirectLoading: boolean;
  @ViewChild('hiddenPaymentForm', {static: false}) hiddenPaymentForm: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private storage: StorageService,
    private creditApiService: CreditApiService,
    private creditPayService: CreditPayService
  ) {
    super();
    this.canExitTrap = true;
    this.canBackTrap = false;
  }

  ngOnInit() {
    this.ticketId = this.activatedRoute.snapshot.paramMap.get('ticket');
    this.storage.set({ticket: this.ticketId});
    this.getPaymentData();
  }

  countdownHandler($event: CountdownEvent) {
    if ($event.action === 'done') {
      this.callToActionTrigger();
    }
  }

  callToActionTrigger() {
    if (this.redirectLoading) {
      return;
    }
    this.redirectLoading = true;
    this.creditApiService.getByUrl<HiddenFormData>(this.redirectUrl).subscribe(response => {
      let data: {name: string, value: string}[] = [];
      if (response.data) {
        const responseData = JSON.parse(response.data);
        data = Object.keys(responseData).map(key => {
          return {
            name: key,
            value: responseData[key]
          };
        });
      }
      this.redirectForm = {
        url: response.url,
        method: response.redirectMethod,
        data
      };
      setTimeout(() => {
        this.hiddenPaymentForm.nativeElement.submit();
      }, 0);
    }, error => {
      this.creditPayService.goToErrorPage(error && error.result && error.result.message ? error.result.message : '');
    });
  }

  getPaymentData() {
    this.loading = true;
    this.creditApiService.getPurchaseSummary(this.ticketId).subscribe(response => {
      this.message = response.message.text;
      this.messageStatus = this.getMessageStatue(response);
      this.mainLabel = response.mainLabel;
      this.currencyLabel = response.currencyLabel;
      this.basketAmount = +response.basketAmount;
      this.buttonLabel = response.buttonLabel;
      this.redirectUrl = response.redirectUrl;
      this.loading = false;
      this.steps = this.transformSteps(response.summaryItems);
    }, error => {
      this.creditPayService.goToErrorPage(error && error.result && error.result.message ? error.result.message : '');
    });
  }

  getMessageStatue(response: CreditPurchaseSummaryResponse): MessageStatus {
    return response.summaryItems.find(item => item.status === 'FAILED') ? 'danger' : 'warning';
  }

  private transformSteps(summaryItems: PurchaseSummaryItem[]): PayStep[] {
    return summaryItems.map(item => {
      return {
        title: item.label,
        amount: item.amount,
        currency: item.currency,
        status: StepStatusMap[item.status]
      };
    });
  }
}
