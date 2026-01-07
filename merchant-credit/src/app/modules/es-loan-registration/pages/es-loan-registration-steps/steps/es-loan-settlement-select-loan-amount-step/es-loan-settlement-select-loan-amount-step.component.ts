import { ChangeDetectionStrategy, Component, computed, inject, model, OnInit, signal } from '@angular/core';

import { BorderColorsEnum } from '@digipay/ngx-divider';
import {
  EsLoanRegistrationApiService
} from '../../../../../../api/clients/es-loan-registration/es-loan-registration-api.service';
import {
  EsLoanRegistrationBaseStepComponent
} from '../es-loan-registration-base-step/es-loan-registration-base-step.component';
import {
  EsLoanTermsDialogComponent
} from '../../../../../../sub-modules/es-loan-ui/es-loan-terms-dialog/es-loan-terms-dialog.component';
import { SmartDialog } from '../../../../../../user-interface/services/smart-dialog';
import { currencyFormat } from '@digipay/strings';
import { SharedApiService } from '../../../../../../api/clients/shared/shared-api.service';
import {
  EsLoanSettlementPreviewModel
} from '../../../../../../api/clients/es-loan-registration/models/es-loan-settlement-preview-model';
import { Router } from '@angular/router';
import { MessageService } from '../../../../../../core/message.service';

@Component({
  selector: 'es-loan-settlement-select-loan-amount-step',
  templateUrl: './es-loan-settlement-select-loan-amount-step.component.html',
  styleUrl: './es-loan-settlement-select-loan-amount-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanSettlementSelectLoanAmountStepComponent extends EsLoanRegistrationBaseStepComponent implements OnInit {

  trackingCode = signal('');
  registrationId = signal('');
  ruleId = signal('');
  agreed = model<boolean>(false);
  isDisable = model<boolean>(false);
  isHint = model<boolean>(false);
  editMode = signal(false);
  showDetail = signal(false);
  minAmount = signal(0);
  maxAmount = signal(0);
  amount = signal(0);
  percentage = signal<number>(23);
  finalFee = signal<number>(0);

  previewDetail = signal({} as EsLoanSettlementPreviewModel);
  getData = model<boolean>(false);

  BorderColorsEnum = BorderColorsEnum;

  esLoanRegistrationApiService = inject(EsLoanRegistrationApiService);
  smartDialog = inject(SmartDialog);
  sharedApiService = inject(SharedApiService);
  messageService = inject(MessageService);
  router = inject(Router);

  ngOnInit() {
    this.getRegistrationId();
  }

  closeClick() {
    this.router.navigate(['/es-loan-registration/overview'], {
      replaceUrl: true
    });
  }

  getRegistrationId() {
    // Get registrationId
    this.esLoanRegistrationApiService.getRegistrationIdFromDetail().subscribe({
      next: (res) => {
        this.registrationId.set(res.registrationId);
        if (this.registrationId()) {
          this.getSettlementInfo(res.registrationId);
        } else {
          return;
        }
      }, error: (error) => {
        this.messageService.showErrorIfExists(error);
        this.isDisable.set(true);
      }
    });
  }

  getSettlementInfo(registrationId: string) {
    this.esLoanRegistrationApiService.getSettlement(registrationId).subscribe({
      next: (res) => {
        this.isDisable.set(false);

        // Get trackingCode
        this.trackingCode.set(res.trackingCode);
        this.getRules(this.registrationId(), this.trackingCode());
      }, error: (error) => {
        this.messageService.showErrorIfExists(error);
        this.isDisable.set(true);
      }

    });
  }

  getPreviewDetail() {
    // Get preview Detail
    if (this.amount() >= this.minAmount() && this.amount() <= this.maxAmount()) {
      this.esLoanRegistrationApiService.getPreview(this.trackingCode(), this.amount(), this.ruleId()).subscribe({
        next: (res) => {
          this.finalFee.set(Math.floor(this.amount() - ((this.amount() * this.percentage() / 100) * 90) / 365));
          this.previewDetail.set(res.creditAllocationDetail);
          this.isDisable.set(false);
        },
        error: (error) => {
          this.messageService.showErrorIfExists(error);
          this.isDisable.set(true);
        }
      });
    }
  }

  getRules(registrationId: string, trackingCode: string) {
    // Get ruleId
    this.esLoanRegistrationApiService.getSettlementRules(registrationId, trackingCode).subscribe({
      next: (res) => {
        this.isDisable.set(false);
        const ruleId = res.ruleDetails.find((item) => item.fundProviderId === 'saman')?.ruleId;
        this.ruleId.set(ruleId as string);
        if (this.ruleId()) {
          // Get min and max amount
          this.sharedApiService.getSettlementConfig(trackingCode, this.ruleId()).subscribe({
            next: (configRes) => {
              this.isDisable.set(false);
              this.maxAmount.set(configRes.maxCreditAmount);
              this.amount.set(configRes.maxCreditAmount);
              this.minAmount.set(configRes.minCreditAmount);
              this.getData.set(true);
              this.getPreviewDetail();
            },
            error: (error) => {
              this.messageService.showErrorIfExists(error);
              this.isDisable.set(true);
            }
          });
        }
      },
      error: (error) => {
        this.messageService.showErrorIfExists(error);
        this.isDisable.set(true);
      }
    });
  }

  formattedAmount = computed(() => {
    const amountValue = this.amount();
    return this.editMode()
      ? amountValue
      : (currencyFormat(amountValue));
  });

  isMinusDisabled = computed(() => this.amount() <= this.minAmount());
  isPlusDisabled = computed(() => this.amount() >= this.maxAmount());

  increaseAmount(): void {
    if (!this.isPlusDisabled()) {
      this.amount.set(this.amount() + 10000);
      this.getPreviewDetail();

    }
  }

  decreaseAmount(): void {
    if (!this.isMinusDisabled()) {
      this.amount.set(this.amount() - 10000);
      this.getPreviewDetail();

    }
  }

  onAmountChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const input = inputElement.value.replace(/,/g, '');
    const parsedValue = parseInt(input, 10);

    if (input.trim() === '') {
      inputElement.value = '';
      this.amount.set(0);
      this.finalFee.set(0);
      return;
    }
    this.isHint.set(true);
    this.amount.set(parsedValue);
    this.getPreviewDetail();
    this.formattedAmount();
  }

  getInputWidth(value: any): number {
    return Math.max(value.length * 8, 50);
  }

  toggleDetail() {
    this.showDetail.set(!this.showDetail());
  }

  agreeTerms(agree: boolean) {
    this.agreed.set(agree);
  }

  showTac() {
    this.smartDialog.open(EsLoanTermsDialogComponent);
  }

  submit() {
    this.esLoanRegistrationApiService.settlementFeeInit(this.trackingCode(), this.amount(), this.ruleId()).subscribe(
      {
        next: () => {
          this.isDisable.set(false);
          this.closeClick();
        }, error: (error) => {
          this.messageService.showErrorIfExists(error);
          this.isDisable.set(true);
        }
      });
  }

}
