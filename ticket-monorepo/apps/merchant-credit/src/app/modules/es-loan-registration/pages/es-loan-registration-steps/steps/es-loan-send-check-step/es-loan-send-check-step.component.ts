import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, model, OnInit, signal } from '@angular/core';
import {
  EsLoanRegistrationBaseStepComponent
} from '../es-loan-registration-base-step/es-loan-registration-base-step.component';
import { Router } from '@angular/router';
import { StepConfigAction } from '../../../../../../api/clients/registration-v3/basic-models/step-result-config.model';
import {
  EsLoanSendEmailStateEnum
} from '../../../../../../api/clients/es-loan-registration/models/es-loan-send-email-state.enum';
import {
  EsLoanRegistrationApiService
} from '../../../../../../api/clients/es-loan-registration/es-loan-registration-api.service';
import { MessageService } from '../../../../../../core/message.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import moment from 'jalali-moment';

@Component({
  selector: 'es-loan-send-check-step',
  templateUrl: './es-loan-send-check-step.component.html',
  styleUrl: './es-loan-send-check-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLoanSendCheckStepComponent extends EsLoanRegistrationBaseStepComponent implements OnInit {
  destroyRef = inject(DestroyRef);

  messageData!: StepConfigAction;
  showResult = model<boolean>(false);
  trackingCode = signal('');
  registrationId = signal('');
  nationalCode = signal('');
  ruleId = signal('');
  esLoanSendEmailState = EsLoanSendEmailStateEnum;

  esLoanRegistrationApiService = inject(EsLoanRegistrationApiService);
  messageService = inject(MessageService);
  router = inject(Router);

  finalRequestedAmount = signal<number>(0);
  settlementDate = signal<number>(0);

  ngOnInit(): void {
    this.getData();
    this.messageData = {
      title: 'درحال بررسی اطلاعات هستیم',
      message: 'شما قبلا وارد فرم ارسال چک اقساط شده‌اید؛ در صورت تکمیل نکردن، می‌توانید از بخش زیر مجدد وارد شوید.',
      buttons: [{
        id: 'primary',
        buttonMode: 'curved',
        buttonStyle: 'tinted',
        label: 'تکمیل فرم'

      },
        {
          id: 'secondary',

          buttonMode: 'default',
          buttonStyle: 'link',
          label: 'بازگشت'
        }],
      staticImage: 'assets/icons/data-illustration.svg'
    };
  }

  closeClick() {
    this.router.navigate(['/es-loan-registration/overview'], {
      replaceUrl: true
    });
  }

  onClick(id: string) {
    if (id === 'primary') {
      this.openPorsline();
    } else if (id === 'secondary') {
      this.closeClick();
    }
  }

  confirmEmail() {
    this.esLoanRegistrationApiService.sendEmail(this.trackingCode()).subscribe({
      next: () => {
        this.showResult.set(false);
        this.openPorsline();
        this.reloadDataEvent.emit(true);
      },
      error: (error) => {
        this.messageService.showErrorIfExists(error);
      }
    });
  }

  checkSendState = computed(() => {
    return this.esLoanStateModel()!.state === this.esLoanSendEmailState.PROVIDER_VERIFICATION_COMPLETED
      || this.esLoanStateModel()!.state === this.esLoanSendEmailState.ES_LOAN_CHEQUE_REJECTED;
  });

  checkWaitingState = computed(() => {
    return this.esLoanStateModel()!.state === this.esLoanSendEmailState.ES_LOAN_CHEQUE_IMAGE_RECEIVED
      || this.esLoanStateModel()!.state === this.esLoanSendEmailState.ES_LOAN_CHEQUE_GUIDELINE_SENT;
  });

  openPorsline(): void {
    const m = moment(this.settlementDate()).add(92, 'days').locale('fa');
    const formatted = m.format('DD-MM-YYYY');

    const baseUrl = new URL('https://survey.porsline.ir/s/DsVCl7e');
    baseUrl.searchParams.set('nationalCode', this.nationalCode());
    baseUrl.searchParams.set('requestedAmount', this.formatNumberWithCommas(this.finalRequestedAmount()));
    baseUrl.searchParams.set('repaymentDate', formatted);

    window.open(baseUrl.toString(), '_blank');
  }

  getData(): void {
    this.esLoanRegistrationApiService.getRegistrationIdFromDetail().pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((res) => {
        if (!res) {
          return of();
        }
        this.registrationId.set(res.registrationId);
        this.nationalCode.set(encodeURIComponent(res.nationalCode));
        return this.esLoanRegistrationApiService.getSettlement(res.registrationId);
      }),
      switchMap((res) => {
        this.trackingCode.set(res.trackingCode);
        return this.esLoanRegistrationApiService.getSettlementRules(this.registrationId(), this.trackingCode());
      }),
      switchMap((res) => {
        const ruleId = res.ruleDetails.find((item) => item.fundProviderId === 'saman')?.ruleId;
        this.ruleId.set(ruleId as string);
        return this.esLoanRegistrationApiService.getPreview(this.trackingCode(), this.requestAmount(), this.ruleId());
      })
    ).subscribe({
      next: (res) => {
        this.finalRequestedAmount.set(res?.creditAllocationDetail?.requestedAmount);
        this.settlementDate.set(res?.creditAllocationDetail?.settlementDate);
      },
      error: (error) => {
        this.messageService.showErrorIfExists(error);
      }
    });
  }

  formatNumberWithCommas(input: number): string {
    const numStr = input.toString(); // تبدیل به رشته
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
