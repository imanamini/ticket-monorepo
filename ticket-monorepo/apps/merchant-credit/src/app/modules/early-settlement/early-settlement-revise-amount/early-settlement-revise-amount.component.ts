import { Component, Input, OnInit } from '@angular/core';
import { CreditAllocationDetail } from '../../../api/clients/early-settlement/basic-models/credit-allocation-detail';
import { ConfigService } from '../../../services/config.service';
import {
  GetSettlementConfigResponse
} from '../../../api/clients/shared/response-models/get-settlement-config.response';
import {
  GetSettlementDetailTransformedResponse
} from '../../../api/clients/early-settlement/response-models/get-settlement-detail.response';
import { FeeInitResponse } from '../../../api/clients/early-settlement/response-models/fee-init.response';
import { SettlementSteps } from '../../../api/clients/early-settlement/basic-models/settlement-steps';
import { Router } from '@angular/router';
import { EarlySettlementApiService } from '../../../api/clients/early-settlement/early-settlement-api.service';
import { EarlySettlementRule } from '../../../api/clients/early-settlement/basic-models/early-settlement-rules';
import { MessageService } from '../../../core/message.service';

@Component({
  selector: 'app-early-settlement-revise-amount',
  templateUrl: './early-settlement-revise-amount.component.html',
  styleUrls: ['./early-settlement-revise-amount.component.scss']
})
export class EarlySettlementReviseAmountComponent implements OnInit {

  previewData?: CreditAllocationDetail;
  rulesData: EarlySettlementRule[] = [];
  payable: boolean = false;
  config?: GetSettlementConfigResponse;
  @Input()
  detail?: GetSettlementDetailTransformedResponse;
  @Input()
  trackingCode: string = '';
  ruleId: string = '';
  selectedRule?: string = '';
  fundProviderName: string = '';
  hasBackButton: boolean = true;
  gettingConfig: boolean = false;
  payableSteps = [
    {
      type: SettlementSteps.GET_RULE,
      pageTitle: 'انتخاب طرح تسویه'
    },
    {
      type: SettlementSteps.GET_AMOUNT,
      pageTitle: 'انتخاب مبلغ قابل تسویه'
    },
    {
      type: SettlementSteps.PAYMENT,
      pageTitle: 'تایید مبلغ کارمزد'
    }
  ];

  notPayableSteps = [
    {
      type: SettlementSteps.GET_RULE,
      pageTitle: 'انتخاب طرح تسویه'
    },
    {
      type: SettlementSteps.GET_AMOUNT,
      pageTitle: 'انتخاب مبلغ قابل تسویه'
    },
    {
      type: SettlementSteps.CONFIRMATION_DIALOG,
      pageTitle: 'تایید مبلغ کارمزد'
    },
    {
      type: SettlementSteps.RESULT,
      pageTitle: 'نتیجه درخواست'
    },
  ];
  steps = this.notPayableSteps;
  stepTypeEnum = SettlementSteps;
  activeStepIndex = 0;
  successResultData?: FeeInitResponse;
  amount: number = 0;

  constructor(
    private earlySettlementApiService: EarlySettlementApiService,
    private configService: ConfigService,
    private messageService: MessageService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.earlySettlementApiService.getRegistrationIdFromDetail().subscribe(res => {
      this.getRules(res.registrationId);
    });
  }

  getRules(registrationId: string) {
    this.earlySettlementApiService.getRules(registrationId,this.trackingCode).subscribe(rules => {
      this.rulesData = rules.ruleDetails;
      const firstEnabledElement = this.rulesData.find(element => element.enabled);
      this.selectedRule = firstEnabledElement?.ruleId;
      this.fundProviderName = firstEnabledElement?.fundProviderName ? firstEnabledElement?.fundProviderName : '';
      this.ruleId = this.selectedRule ? this.selectedRule : '';
      this.gettingConfig = true;
      this.configService.getSettlementConfig(this.trackingCode, this.ruleId).subscribe(configResponse => {
          this.config = configResponse;
          this.gettingConfig = false;
        }
        , error => {
          this.messageService.showErrorIfExists(error);
        });
    });
  }

  getConfig(event: any) {
    this.gettingConfig = true;
    this.configService.getSettlementConfig(this.trackingCode, event.ruleId).subscribe(configResponse => {
      this.config = configResponse;
      this.ruleId = event.ruleId;
      this.fundProviderName = event.fundProviderName;
      this.gettingConfig = false;
    }, error => {
      this.messageService.showErrorIfExists(error);
    });
  }

  nextSettlementStep() {
    if (this.activeStepIndex < this.steps.length - 1) {
      this.activeStepIndex = this.activeStepIndex + 1;
    } else {
      this.finishFlow();

    }

    if (this.steps[this.activeStepIndex].pageTitle === 'نتیجه درخواست') {
      this.hasBackButton = false;
    }
  }

  prevSettlementStep() {
    if (this.activeStepIndex > 0) {
      this.activeStepIndex = this.activeStepIndex - 1;
    } else {
      this.closeFlow();
    }
  }

  finishFlow(): void {
    this.router.navigateByUrl('/early-settlement/list').then();
  }

  closeFlow(): void {
    this.configService.exit();
  }

  onChangePayableStatus(payable: boolean) {
    this.payable = payable;
    this.steps = payable ? this.payableSteps : this.notPayableSteps;
  }

  onChangeAmount($event: { amount: number; previewData: CreditAllocationDetail }) {
    this.amount = $event.amount;
    this.previewData = $event.previewData;
  }
}
