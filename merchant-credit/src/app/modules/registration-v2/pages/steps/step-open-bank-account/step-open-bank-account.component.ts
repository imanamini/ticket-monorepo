import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../registration.service';
import { RegistrationState } from '../../../../../api/models/registration/states';
import { UploadableFile } from '../../../../../api/models/upload/uploadable-file';
import { switchMap } from 'rxjs/operators';

enum OpenBankAction {
  OVERVIEW_STEP = 1,
  UPLOAD_STEP = 2,
  SUCCESS = 5,
  REJECTED = 6,
  GETTING_DOCUMENT = 7,
  NEXT_STEP = 8
}

enum RegistrationChanges {
  REMOVE_NATIONAL_CARD_IMAGES = 1,
  DIGITAL_SIGNATURE_WITH_TICKET = 2,
  MIDDLE_EAST_STATE_MACHINE_JOURNEY = 3,
  DIGITAL_SIGNATURE_WITH_PASSWORD = 5,
}

@Component({
  selector: 'step-open-bank-account',
  templateUrl: './step-open-bank-account.component.html',
  styleUrls: ['./step-open-bank-account.component.scss']
})
export class StepOpenBankAccountComponent implements OnInit {

  stepTitles = [
    'تایید اطلاعات افتتاح حساب',
    'آپلود تصاویر',
    'تایید اطلاعات افتتاح حساب'
  ];

  openBankActionEnum = OpenBankAction;

  inProgressAction?: OpenBankAction;

  files: UploadableFile[] = [];

  registrationChanges: number[] = [];

  stateToAction: { [key in RegistrationState]?: OpenBankAction } = {
    [RegistrationState.OPEN_ACCOUNT]: OpenBankAction.OVERVIEW_STEP,
    [RegistrationState.OPEN_ACCOUNT_INQUIRY]: OpenBankAction.SUCCESS,
    [RegistrationState.REJECTED]: OpenBankAction.REJECTED,
    [RegistrationState.CONTRACT_GENERATION]: OpenBankAction.NEXT_STEP,
  };
  newUserStateToAction: { [key in RegistrationState]?: OpenBankAction } = {
    [RegistrationState.UPLOAD_DOCUMENTS]: OpenBankAction.SUCCESS,
    [RegistrationState.OPEN_ACCOUNT]: OpenBankAction.OVERVIEW_STEP,
    [RegistrationState.OPEN_ACCOUNT_INQUIRY]: OpenBankAction.SUCCESS,
    [RegistrationState.REJECTED]: OpenBankAction.REJECTED,
    [RegistrationState.CONTRACT_GENERATION]: OpenBankAction.NEXT_STEP,
  };
  actionToStepIndex: { [key in OpenBankAction]: number } = {
    [OpenBankAction.OVERVIEW_STEP]: 0,
    [OpenBankAction.UPLOAD_STEP]: 1,
    [OpenBankAction.SUCCESS]: -1,
    [OpenBankAction.REJECTED]: -1,
    [OpenBankAction.GETTING_DOCUMENT]: -1,
    [OpenBankAction.NEXT_STEP]: -1
  };

  constructor(
    private service: RegistrationService,
  ) {
  }

  ngOnInit(): void {
    this.getState();
    this.getDetail();
    this.service.getListOfDocumentsForUploading().then(res => {
      this.files = res.files;
    });
  }

  getDetail() {
    this.service.getTicketDetail(true).subscribe(details => {
      if (details) {
        this.registrationChanges = details?.registration?.registrationChanges;
      }
    });
  }

  getState(withoutLoading = false): void {
    if (!withoutLoading) {
      this.inProgressAction = undefined;
    }
    this.service.getStepsFromApi().pipe(
      switchMap(res => {
        const state = res.currentStep;
        if (this.registrationChanges.includes(RegistrationChanges.MIDDLE_EAST_STATE_MACHINE_JOURNEY)) {
          this.handleStateActionForNewUser(state);
        } else {
          this.handleStateAction(state);
        }
        return [];
      })
    ).subscribe();
  }

  handleStateActionForNewUser(state: RegistrationState) {
    if (this.newUserStateToAction[state]) {
      this.dispatchAction(this.newUserStateToAction[state]);
    } else {
      this.service.goToOverviewPage();
    }
  }

  handleStateAction(state: RegistrationState) {
    if (this.stateToAction[state]) {
      this.dispatchAction(this.stateToAction[state]);
    } else {
      this.service.goToOverviewPage();
    }
  }

  uploadDocuments() {
    this.dispatchAction(OpenBankAction.OVERVIEW_STEP);
  }

  dispatchAction(action?: OpenBankAction): void {
    this.inProgressAction = action;
    if (action === OpenBankAction.SUCCESS || action === OpenBankAction.GETTING_DOCUMENT) {
      setTimeout(() => {
        this.getState(true);
      }, 5000);
    }
  }

  backToOverview(): void {
    this.service.goToOverviewPage();
  }
}
