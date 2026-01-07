import { Component, inject, model, OnInit, signal } from '@angular/core';
import {
  EsLoanRegistrationBaseStepComponent
} from '../es-loan-registration-base-step/es-loan-registration-base-step.component';
import { Router } from '@angular/router';
import { BorderColorsEnum } from '@digipay/ngx-divider';
import {
  EsLoanRegistrationApiService
} from '../../../../../../api/clients/es-loan-registration/es-loan-registration-api.service';
import { SmartDialog } from '../../../../../../user-interface/services/smart-dialog';
import { SharedApiService } from '../../../../../../api/clients/shared/shared-api.service';
import { MessageService } from '../../../../../../core/message.service';
import {
  EsLoanSettlementPreviewModel
} from '../../../../../../api/clients/es-loan-registration/models/es-loan-settlement-preview-model';

@Component({
  selector: 'es-loan-settlement-payment-step',
  templateUrl: './es-loan-settlement-payment-step.component.html',
  styleUrl: './es-loan-settlement-payment-step.component.scss'
})
export class EsLoanSettlementPaymentStepComponent extends EsLoanRegistrationBaseStepComponent implements OnInit {
  trackingCode = signal('');
  registrationId = signal('');
  ruleId = signal('');
  getData = model<boolean>(false);
  previewDetail = signal({} as EsLoanSettlementPreviewModel);
  repaymentLoanDate = signal<number | undefined>(undefined);
  finalFee = signal<number>(0);
  percentage = signal<number>(23);
  BorderColorsEnum = BorderColorsEnum;

  esLoanRegistrationApiService = inject(EsLoanRegistrationApiService);
  sharedApiService = inject(SharedApiService);
  smartDialog = inject(SmartDialog);
  messageService = inject(MessageService);
  router = inject(Router);

  ngOnInit() {
    this.getRegistrationId();
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
      }
    });
  }

  getSettlementInfo(registrationId: string) {
    this.esLoanRegistrationApiService.getSettlement(registrationId).subscribe({
      next: (res) => {

        // Get trackingCode
        this.trackingCode.set(res.trackingCode);
        this.getRules(this.registrationId(), this.trackingCode());
      }, error: (error) => {
        this.messageService.showErrorIfExists(error);
      }

    });
  }

  getRules(registrationId: string, trackingCode: string) {
    // Get ruleId
    this.esLoanRegistrationApiService.getSettlementRules(registrationId, trackingCode).subscribe({
      next: (res) => {
        const ruleId = res.ruleDetails.find((item) => item.fundProviderId === 'saman')?.ruleId;
        this.ruleId.set(ruleId as string);
        if (this.ruleId()) {
          this.getPreviewDetail();
        }
      },
      error: (error) => {
        this.messageService.showErrorIfExists(error);
      }
    });
  }

  getPreviewDetail() {
    // Get preview Detail
    this.esLoanRegistrationApiService.getPreview(this.trackingCode(), this.requestAmount(), this.ruleId()).subscribe({
      next: (res) => {
        this.previewDetail.set(res.creditAllocationDetail);
        this.finalFee.set(Math.floor(this.requestAmount() - ((this.requestAmount() * this.percentage() / 100) * 90) / 365));

        this.addDaysTocurrentDate(this.previewDetail().settlementDate);
        this.getData.set(true);
      },
      error: (error) => {
        this.messageService.showErrorIfExists(error);
      }
    });
  }

  addDaysTocurrentDate(currentDate: number) {
    const initialDate = new Date(currentDate);
    const addedDays = 90;
    const newDate = new Date(initialDate);
    newDate.setDate(initialDate.getDate() + addedDays);
    this.repaymentLoanDate.set(newDate.getTime());
  }

  closeClick() {
    this.router.navigate(['/es-loan-registration/overview'], {
      replaceUrl: true
    });
  }

  submit() {
    this.esLoanRegistrationApiService.settlementFeeInit(this.trackingCode(), this.requestAmount(), this.ruleId()).subscribe(
      {
        next: (res) => {
          if (res.payable) {
            this.sharedApiService.getSettlementConfig(this.trackingCode(), this.ruleId()).subscribe(configResponse => {
              window.location.replace(configResponse.ipgUrl + '/' + res.ticket);
            });
          } else {
            return;
          }
        }, error: (error) => {
          this.messageService.showErrorIfExists(error);
        }
      });
  }

}
