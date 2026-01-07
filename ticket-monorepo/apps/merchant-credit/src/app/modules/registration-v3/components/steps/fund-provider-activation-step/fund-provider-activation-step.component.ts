import { Component, OnDestroy, OnInit } from '@angular/core';
import { StepsBaseComponent } from '../steps-base/steps-base.component';
import {
  ICS_STATES,
  StepResultConfig
} from '../../../../../api/models/registration-v3/step-result-config';
import { StepConfigAction } from '../../../../../api/clients/registration-v3/basic-models/step-result-config.model';
import { interval, Subscription } from 'rxjs';
import {
  FundProviderBranchInfoDialogComponent
} from './fund-provider-branch-info-dialog/fund-provider-branch-info-dialog.component';
import { SmartDialog } from '../../../../../user-interface/services/smart-dialog';

@Component({
  selector: 'app-fund-provider-activation-step',
  templateUrl: './fund-provider-activation-step.component.html',
  styleUrls: ['./fund-provider-activation-step.component.scss']
})
export class FundProviderActivationStepComponent extends StepsBaseComponent implements OnInit, OnDestroy {

  errorData: any;
  ICS_STATES = ICS_STATES;
  errorStatus!: ICS_STATES;
  timeoutSubscription!: Subscription;

  constructor(private smartDialog: SmartDialog) {
    super();
  }

  ngOnInit(): void {
    this.errorStatus = this.details?.registration?.currentState;
    const action: StepConfigAction = StepResultConfig[this.errorStatus];
    this.errorData = action;
    this.changeStep();
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
    if (this.errorStatus === ICS_STATES.FUND_PROVIDER_REGISTRATION_REJECTED
      || this.errorStatus === ICS_STATES.FUND_PROVIDER_ACTIVATION_REJECTED
      || this.errorStatus === ICS_STATES.APPROVED
      || this.errorStatus === ICS_STATES.CANCELED) {
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

  showGuide() {
    this.smartDialog.open(FundProviderBranchInfoDialogComponent, {type: this.type});
  }

  showMap() {
    window.open('https://www.google.com/maps/d/embed?mid=1t2UE9FJ6RHe_rBxNAyzXa9EB9CY&ll=35.54493686801307%2C51.334094501999914&z=10', '_blank');
  }

  ngOnDestroy() {
    this.timeoutSubscription.unsubscribe();
  }
}
