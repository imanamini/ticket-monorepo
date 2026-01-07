import { Component, OnDestroy, OnInit } from '@angular/core';
import { StepsBaseComponent } from '../steps-base/steps-base.component';
import { SmartDialog } from '../../../../../user-interface/services/smart-dialog';
import { IcsMoreInfoDialogComponent } from './ics-more-info-dialog/ics-more-info-dialog.component';

import {
  ICS_STATES,
  StepResultConfig
} from '../../../../../api/models/registration-v3/step-result-config';
import { StepConfigAction } from '../../../../../api/clients/registration-v3/basic-models/step-result-config.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-ics-step',
  templateUrl: './ics-step.component.html',
  styleUrls: ['./ics-step.component.scss']
})
export class IcsStepComponent extends StepsBaseComponent implements OnInit, OnDestroy {
  errorData: any;
  timeoutSubscription!: Subscription;
  errorStatus!: ICS_STATES;

  constructor(
    private smartDialog: SmartDialog,
  ) {
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

  moreInfoClick() {
    this.smartDialog.open(IcsMoreInfoDialogComponent);
  }

  onClick(id: string) {
    if (id === 'primary') {
      this.closeClick();
    } else if (id === 'secondary') {
      this.moreInfoClick();
    }
  }

  finishTimer() {
    if(this.errorStatus === ICS_STATES.ICS_REJECTED){
     return;
    }else{
      this.errorData = {
        title: 'در حال انجام امکان‌سنجی بانکی',
        message: 'درحال بررسی امکان دریافت اعتبار شما هستیم، لطفا منتظر بمانید.',
        loading: true,
        timer: {},
        staticImage: 'assets/icons/waiting-ics.svg'
      };
      setTimeout(() => {
        this.errorData = {
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
        };
        this.reloadDataEvent.emit(true);

      }, 3000);
    }
  }

  ngOnDestroy() {
    this.timeoutSubscription.unsubscribe();
  }
}
