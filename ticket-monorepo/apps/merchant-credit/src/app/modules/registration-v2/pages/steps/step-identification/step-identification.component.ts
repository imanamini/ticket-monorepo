import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../registration.service';
import { RegistrationState } from '../../../../../api/models/registration/states';
import { ConfigService } from '../../../../../services/config.service';
import { switchMap } from 'rxjs/operators';

enum IdentificationAction {
  IDENTIFICATION_STEP = 1,
  OTP_STEP = 2,
  BASIC_INFO_STEP = 3,
  ADDRESS_STEP = 4,
  PENDING = 5,
  FAILED_IDENTIFICATION = 6
}

@Component({
  selector: 'step-upload',
  templateUrl: './step-identification.component.html',
  styleUrls: ['./step-identification.component.scss'],
  providers: []
})
export class StepIdentificationComponent implements OnInit {

  stepTitles = [
    'ثبت اطلاعات اولیه',
    'تکمیل اطلاعات فردی',
    'ثبت اطلاعات تکمیلی',
  ];

  IdentificationActionEnum = IdentificationAction;

  inProgressAction?: IdentificationAction;

  stateToAction: { [key in RegistrationState]?: IdentificationAction } = {
    [RegistrationState.IDENTITY_EVALUATION]: IdentificationAction.IDENTIFICATION_STEP,
    [RegistrationState.IDENTITY_EVALUATION_SET_DETAILS]: IdentificationAction.BASIC_INFO_STEP,
    [RegistrationState.IDENTITY_EVALUATION_SET_ADDRESS]: IdentificationAction.ADDRESS_STEP,

    [RegistrationState.OTP_VERIFICATION_SUCCESS]: IdentificationAction.OTP_STEP,
    [RegistrationState.OTP_VERIFICATION_PENDING]: IdentificationAction.OTP_STEP,
    [RegistrationState.OTP_VERIFICATION_INVALID_OTP]: IdentificationAction.OTP_STEP,
    [RegistrationState.OTP_VERIFICATION_OTP_CONFIRMED_BEFORE]: IdentificationAction.OTP_STEP,
    [RegistrationState.OTP_VERIFICATION_CODE_IS_EXPIRED_TRY_AGAIN]: IdentificationAction.OTP_STEP,
    [RegistrationState.OTP_VERIFICATION_REQUEST_IS_INVALID]: IdentificationAction.OTP_STEP,
    [RegistrationState.OTP_VERIFICATION_COUNT_OF_UNSUCCESSFUL_RETRY_IS_NOT_LEGAL]: IdentificationAction.OTP_STEP,
    [RegistrationState.OTP_VERIFICATION_SEND_OTP_MAX_RETRY_REACHED]: IdentificationAction.OTP_STEP,
    [RegistrationState.OTP_VERIFIED]: IdentificationAction.PENDING,
    [RegistrationState.OTP_FAILED]: IdentificationAction.OTP_STEP,
    [RegistrationState.IDENTITY_REGISTRATION_INQUIRY_COMPLETED]: IdentificationAction.BASIC_INFO_STEP,
    [RegistrationState.IDENTITY_REGISTRATION_INQUIRY_FAILED]: IdentificationAction.FAILED_IDENTIFICATION,
    [RegistrationState.IDENTITY_INFO_COMPLETED]: IdentificationAction.PENDING,
    [RegistrationState.INVALID_IDENTITY_INFO]: IdentificationAction.ADDRESS_STEP
  };

  actionToStepIndex: { [key in IdentificationAction]: number } = {
    [IdentificationAction.FAILED_IDENTIFICATION]: -1,
    [IdentificationAction.PENDING]: -1,
    [IdentificationAction.IDENTIFICATION_STEP]: 0,
    [IdentificationAction.OTP_STEP]: 1,
    [IdentificationAction.BASIC_INFO_STEP]: 2,
    [IdentificationAction.ADDRESS_STEP]: 3
  };

  constructor(
    private service: RegistrationService,
    private configService: ConfigService
  ) {
  }

  ngOnInit(): void {
    this.getState();
  }

//CHECK
  getState(): void {
    this.inProgressAction = undefined;

    this.service.getStepsFromApi().pipe(
      switchMap(res => {
        const state = res.currentStep;
        if (this.stateToAction[state]) {
          this.dispatchAction(this.stateToAction[state]);
        } else {
          this.service.goToOverviewPage();
        }
        return [];
      })
    ).subscribe();
  }

  dispatchAction(action?: IdentificationAction) {
    this.inProgressAction = action;
    if (action === IdentificationAction.PENDING) {
      setTimeout(() => {
        this.getState();
      }, 5000);
    }
  }

  exit(): void {
    this.configService.exit();
  }
}
