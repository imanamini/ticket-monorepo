import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { EsLoanSamanBaseStepComponent } from '../es-loan-saman-base-step/es-loan-saman-base-step.component';
import { interval, Subscription } from 'rxjs';
import { SmartDialog } from '../../../../../../../../../user-interface/services/smart-dialog';
import {
  StepConfigAction
} from '../../../../../../../../../api/clients/registration-v3/basic-models/step-result-config.model';
import {
  ES_LOAN_ICS_STATES, EsLoanStepResultConfig
} from '../../../../../../../../../api/clients/es-loan-registration/es-loan-step-result-config';
import {
  EsLoanSamanIcsMoreInfoDialogComponent
} from './es-loan-saman-ics-more-info-dialog/es-loan-saman-ics-more-info-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'es-loan-saman-ics-step',
  templateUrl: './es-loan-saman-ics-step.component.html',
  styleUrl: './es-loan-saman-ics-step.component.scss'
})
export class EsLoanSamanIcsStepComponent extends EsLoanSamanBaseStepComponent implements OnInit {
  timeoutSubscription!: Subscription;
  errorData = signal<any>({} as any);
  errorStatus = signal<ES_LOAN_ICS_STATES>({} as ES_LOAN_ICS_STATES);

  router = inject(Router);
  smartDialog = inject(SmartDialog);

  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.errorStatus.set(this.details()?.registration?.currentState);
    const action: StepConfigAction = EsLoanStepResultConfig[this.errorStatus()];
    this.errorData.set(action);
    this.changeStep();
    setInterval(() => {
      this.cdr.detectChanges();
    }, 1000);
  }

  changeStep() {
    this.timeoutSubscription = interval(10000).subscribe(() => {
      this.reloadDataEvent.emit(true);
    });
  }

  closeClick() {
    this.router.navigate(['/es-loan-registration/overview'], {
      replaceUrl: true
    });
  }

  moreInfoClick() {
    this.smartDialog.open(EsLoanSamanIcsMoreInfoDialogComponent);
  }

  onClick(id: string) {
    if (id === 'primary') {
      this.closeClick();
    } else if (id === 'secondary') {
      this.moreInfoClick();
    }
  }

  finishTimer() {
    if (this.errorStatus() === ES_LOAN_ICS_STATES.ICS_REJECTED) {
      return;
    } else {
      this.errorData.set({
        title: 'در حال انجام امکان‌سنجی بانکی',
        message: 'درحال بررسی امکان دریافت اعتبار شما هستیم، لطفا منتظر بمانید.',
        loading: true,
        timer: {},
        staticImage: 'assets/icons/waiting-ics.svg'
      });
      setTimeout(() => {
        this.errorData.set({
          title: 'درحال انجام امکان‌سنجی بانکی',
          message: 'متاسفانه مشکلی در امکان‌سنجی بانکی پیش آمده است؛ پس از برطرف شدن از طریق پیامک به شما اطلاع خواهیم داد.',
          timer: {},
          buttons: [{
            id: 'primary',
            buttonMode: 'default',
            buttonStyle: 'tinted',
            label: 'متوجه شدم!'
          }],
          staticImage: 'assets/icons/waiting-ics.svg'
        });
        this.reloadDataEvent.emit(true);

      }, 3000);
    }
  }

  ngOnDestroy() {
    this.timeoutSubscription.unsubscribe();
  }
}
