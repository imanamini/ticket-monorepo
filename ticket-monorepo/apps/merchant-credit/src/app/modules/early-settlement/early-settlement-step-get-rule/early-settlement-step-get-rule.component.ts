import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  GetSettlementConfigResponse
} from '../../../api/clients/shared/response-models/get-settlement-config.response';
import {
  GetSettlementDetailTransformedResponse
} from '../../../api/clients/early-settlement/response-models/get-settlement-detail.response';
import { EarlySettlementRule } from '../../../api/clients/early-settlement/basic-models/early-settlement-rules';

@Component({
  selector: 'app-early-settlement-step-get-rule',
  templateUrl: './early-settlement-step-get-rule.component.html',
  styleUrls: ['./early-settlement-step-get-rule.component.scss']
})
export class EarlySettlementStepGetRuleComponent implements OnInit, OnChanges {

  @Output() prevStep = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<void>();
  @Output() changePayableStatus = new EventEmitter<boolean>();
  @Output() emitRuleId = new EventEmitter<{}>();

  @Input() invoiceAmount: number = 0;
  @Input() config?: GetSettlementConfigResponse;
  @Input() detail?: GetSettlementDetailTransformedResponse;
  @Input() rules: EarlySettlementRule[] = [];
  maxAmount: number = 0;
  @Input() selectedRule?: string = '';
  @Input() gettingConfig : boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  onRuleClick(rule: EarlySettlementRule): void {
    this.selectedRule = rule.ruleId;
    this.emitRuleId.emit({ruleId: this.selectedRule, fundProviderName: rule.fundProviderName});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config || changes.disabled) {
      this.prepareData();
    }
  }

  prepareData(): void {
    if (this.config) {
      this.maxAmount = this.config.maxCreditAmount;
    }
    if (this.detail) {
      this.invoiceAmount = this.detail.settlement.invoiceAmount;
    }
  }

  onSubmit() {
    this.nextStep.emit();
  }
}
