import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { EsLoanSamanBaseStepComponent } from '../es-loan-saman-base-step/es-loan-saman-base-step.component';
import { interval, Subscription } from 'rxjs';
import { SmartDialog } from '../../../../../../../../../user-interface/services/smart-dialog';
import {
  StepConfigAction
} from '../../../../../../../../../api/clients/registration-v3/basic-models/step-result-config.model';
import { EsLoanSamanService } from '../../../services/es-loan-saman.service';
import {
  ES_LOAN_ICS_STATES, EsLoanStepResultConfig
} from '../../../../../../../../../api/clients/es-loan-registration/es-loan-step-result-config';

@Component({
  selector: 'es-loan-saman-fund-provider-activation-step',
  templateUrl: './es-loan-saman-fund-provider-activation-step.component.html',
  styleUrl: './es-loan-saman-fund-provider-activation-step.component.scss'
})
export class EsLoanSamanFundProviderActivationStepComponent extends EsLoanSamanBaseStepComponent implements OnInit, OnDestroy {
  errorData!: StepConfigAction;
  ICS_STATES = ES_LOAN_ICS_STATES;
  errorStatus!: ES_LOAN_ICS_STATES;

  docItems = signal<string[]>([]);

  timeoutSubscription!: Subscription;

  smartDialog = inject(SmartDialog);
  esLoanSamanService = inject(EsLoanSamanService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.errorStatus = this.details()?.registration?.currentState;
    const action: StepConfigAction = EsLoanStepResultConfig[this.errorStatus];
    this.errorData = action;
    this.changeStep();
    this.getDocumentData();
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
    window.history.back();
  }

  finishTimer() {
    if (this.errorStatus === ES_LOAN_ICS_STATES.FUND_PROVIDER_REGISTRATION_REJECTED
      || this.errorStatus === ES_LOAN_ICS_STATES.FUND_PROVIDER_ACTIVATION_REJECTED
      || this.errorStatus === ES_LOAN_ICS_STATES.APPROVED
      || this.errorStatus === ES_LOAN_ICS_STATES.CANCELED) {
      return;
    } else {
      this.errorData = {
        title: 'درحال ارسال اطلاعات به بانک',
        message: 'اطلاعات شما درحال ارسال به بانک است، لطفا منتظر بمانید.',
        loading: true,
        timer: {},
        staticImage: 'assets/icons/waiting-bank.svg'
      };
      setTimeout(() => {
        this.errorData = {
          title: 'درحال ارسال اطلاعات به بانک',
          message: 'متاسفانه مشکلی پیش آمده است؛ پس از برطرف شدن از طریق پیامک به شما اطلاع خواهیم داد.',
          timer: {},
          buttons: [{
            id: 'primary',
            buttonMode: 'default',
            buttonStyle: 'tinted',
            label: 'متوجه شدم!'
          }],
          staticImage: 'assets/icons/waiting-bank.svg'
        };
        this.reloadDataEvent.emit(true);
      }, 3000);
    }
  }

  showMap() {
    window.open('https://www.google.com/maps/d/embed?mid=1t2UE9FJ6RHe_rBxNAyzXa9EB9CY&ll=35.54493686801307%2C51.334094501999914&z=10', '_blank');
  }

  getDocumentData() {
    const samanDocument = this.esLoanSamanService.getSamanDocumentsForBranches(this.type());
    const maxCreditAmountString = localStorage.getItem('maxCreditAmount');
    const maxCreditAmount = maxCreditAmountString !== null ? Number(maxCreditAmountString) : null;

    this.docItems.set(samanDocument
      .filter(item => item.maxCreditAmount === maxCreditAmount)
      .flatMap(item => item.items || []));
  }

  ngOnDestroy() {
    this.timeoutSubscription.unsubscribe();
  }

}
