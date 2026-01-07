import { Component, Input, OnInit } from '@angular/core';
import { CreditAllocationDetail } from '../../../api/clients/early-settlement/basic-models/credit-allocation-detail';
import { EarlySettlementApiService } from '../../../api/clients/early-settlement/early-settlement-api.service';
import { StorageService } from '../../../services/storage.service';
import { ConfigService } from '../../../services/config.service';
import { MessageService } from '../../../core/message.service';
import { ApiErrorStatus } from '../../../api/clients/early-settlement/basic-models/api-error-status';

@Component({
  selector: 'early-settlement-step-payment',
  templateUrl: './early-settlement-step-payment.component.html',
  styleUrls: ['./early-settlement-step-payment.component.scss']
})
export class EarlySettlementStepPaymentComponent implements OnInit {
  @Input() previewData?: CreditAllocationDetail;
  @Input() amount: number = 0;
  @Input() trackingCode: string = '';
  @Input() ruleId: string = '';
  @Input() fundProviderName: string = '';
  profileDisabled: boolean = false;
  submitting: boolean = false;

  constructor(
    private earlySettlementApiService: EarlySettlementApiService,
    private storageService: StorageService,
    private configService: ConfigService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
  }

  submit() {
    if (this.submitting) {
      return;
    }
    const amount = this.amount;
    this.submitting = true;

    this.earlySettlementApiService.settlementFeeInit(this.trackingCode, amount, this.ruleId).subscribe(response => {
      this.storageService.setTicket(response.ticket);
      this.configService.getSettlementConfig(this.trackingCode, this.ruleId).subscribe(configResponse => {
        window.location.replace(configResponse.ipgUrl + '/' + this.storageService.getTicket());
      });
      setTimeout(() => {
        this.submitting = false;
      }, 0);
    }, error => {
      if (error?.error?.result?.status === ApiErrorStatus.MERCHANT_CREDIT_SETTLEMENT_PROFILE_DISABLED) {
        this.profileDisabled = true;
      }else{
      this.submitting = false;
      this.messageService.showErrorIfExists(error);
      }

    });

  }
}
