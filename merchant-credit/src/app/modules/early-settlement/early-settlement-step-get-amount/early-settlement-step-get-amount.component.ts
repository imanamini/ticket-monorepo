import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { EarlySettlementApiService } from '../../../api/clients/early-settlement/early-settlement-api.service';
import { CreditAllocationDetail } from '../../../api/clients/early-settlement/basic-models/credit-allocation-detail';
import { MessageService } from '../../../core/message.service';
import { PageDialogComponent } from '../../../user-interface/ui-components/page-dialog/page-dialog.component';
import {
  GetSettlementConfigResponse
} from '../../../api/clients/shared/response-models/get-settlement-config.response';
import {  MatDialog } from '@angular/material/dialog';
import {
  GetSettlementDetailTransformedResponse
} from '../../../api/clients/early-settlement/response-models/get-settlement-detail.response';
import { numberToString } from '../../../utils/number-to-string';
import { ApiErrorStatus } from '../../../api/clients/early-settlement/basic-models/api-error-status';

@Component({
  selector: 'early-settlement-step-get-amount',
  templateUrl: './early-settlement-step-get-amount.component.html',
  styleUrls: ['./early-settlement-step-get-amount.component.scss']
})
export class EarlySettlementStepGetAmountComponent implements OnInit {
  @Input() trackingCode: string = '';
  @Input() ruleId: string = '';
  @Input() invoiceAmount: number = 0;
  @Input() config?: GetSettlementConfigResponse;
  @Input() detail?: GetSettlementDetailTransformedResponse;
  @Output() prevStep = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<void>();
  @Output() changeAmount = new EventEmitter<{ amount: number, previewData: CreditAllocationDetail }>();
  @Output() changePayableStatus = new EventEmitter<boolean>();
  form: UntypedFormGroup;
  errorMessageMapper: { [key: string]: string } = {
    min: 'مبلغ ورودی کمتر از حداقل مبلغ قابل درخواست است',
    max: 'مبلغ ورودی بیشتر از مبلغ قابل درخواست است'
  };
  fieldHint: string = '';
  minAmount: number = 0;
  maxAmount: number = 0;
  valueOfAmount: number = 0;
  focusMode: boolean = false;
  gettingPreviewTimer: any;
  gettingDataDelay = 1000;
  cachedPreviewData: { [key: number]: CreditAllocationDetail } = {};
  cachedMinFeeDifference: { [key: number]: number } = {};
  cachedMinFeeDifferenceLabel: { [key: number]: string } = {};
  gettingPreview: boolean = false;
  previewData?: CreditAllocationDetail;
  minFeeDifference: number = 0;
  minFeeDifferenceLabel: string = '';
  profileDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private earlySettlementApiService: EarlySettlementApiService,
    private dialog: MatDialog
  ) {
    this.form = this.formBuilder.group({
      amount: ['', [this.amountValidation.bind(this), Validators.required]]
    });
    this.form.controls['amount'].valueChanges.subscribe(() => {
      this.fieldHint = '';
      const errors = this.form.controls['amount'].errors;
      if (errors) {
        Object.keys(errors).map(errorKey => {
          if (!this.fieldHint && errors[errorKey] && this.errorMessageMapper[errorKey]) {
            this.fieldHint = this.errorMessageMapper[errorKey];
          }
        });
      }
    });
  }

  ngOnInit(): void {
    if (this.config && this.detail) {
      this.invoiceAmount = this.detail.settlement.invoiceAmount;
      this.minAmount = this.config.minCreditAmount;
      this.maxAmount = this.config.maxCreditAmount;
      this.errorMessageMapper.min = 'حداقل مبلغ قابل درخواست ' + numberToString(this.minAmount) + ' ریال هست';
    }

  }

  amountValidation(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const value = parseInt(control.value.replace(/[^\d]/g, ''));
    if (value <= this.minAmount) {
      return {min: true};
    }
    if (value > this.maxAmount) {
      return {max: true};
    }
    return null;
  }

  onAmountChange(event: any) {
    if (event) {
      this.valueOfAmount = event;
      if (this.gettingPreviewTimer) {
        clearTimeout(this.gettingPreviewTimer);
      }
      this.gettingPreviewTimer = setTimeout(() => {
        this.getPreviewData();
      }, this.gettingDataDelay);
    }

  }

  getPreviewData(): void {
    if (this.valueOfAmount == 0 || this.valueOfAmount < this.minAmount || this.valueOfAmount > this.maxAmount) {
      return;
    }
    if (this.cachedPreviewData[this.valueOfAmount]) {
      this.previewData = this.cachedPreviewData[this.valueOfAmount];
      this.minFeeDifference = this.cachedMinFeeDifference[this.valueOfAmount];
      this.minFeeDifferenceLabel = this.cachedMinFeeDifferenceLabel[this.valueOfAmount];
      this.changeAmount.emit({amount: this.valueOfAmount, previewData: this.previewData});
      return;
    }
    this.gettingPreview = true;
    this.earlySettlementApiService.getPreview(this.trackingCode, this.valueOfAmount, this.ruleId).subscribe(response => {
      this.previewData = response.creditAllocationDetail;
      this.changePayableStatus.emit(response.payable);
      this.minFeeDifference = response.minFeeDifference || 0;
      this.minFeeDifferenceLabel = response.minFeeDifferenceLabel || '';
      this.cachedPreviewData[this.valueOfAmount] = response.creditAllocationDetail;
      this.cachedMinFeeDifference[this.valueOfAmount] = response.minFeeDifference || 0;
      this.cachedMinFeeDifferenceLabel[this.valueOfAmount] = response.minFeeDifferenceLabel || '';
      this.changeAmount.emit({amount: this.valueOfAmount, previewData: this.previewData});
      this.gettingPreview = false;
    }, (error) => {
      if (error?.error?.result?.status === ApiErrorStatus.MERCHANT_CREDIT_SETTLEMENT_PROFILE_DISABLED) {
        this.profileDisabled = true;
      }else{
        if (error && error.error.errorMessages && error.error.errorMessages[0] && error.error) {
          this.messageService.showErrorMessage(error.error.errorMessages[0]);
        } else {
          this.messageService.showErrorIfExists(error);
        }
      }

    });
  }

  openTac(): void {
    if (!this.config?.tacUrl) {
      return;
    }
    this.dialog.open(PageDialogComponent, {
      panelClass: ['page-dialog-component'],
      data: {
        title: 'قوانین و مقررات',
        pageId: this.config?.tacUrl
      }
    });
  }

  onSubmit() {
    this.nextStep.emit();
  }
}
