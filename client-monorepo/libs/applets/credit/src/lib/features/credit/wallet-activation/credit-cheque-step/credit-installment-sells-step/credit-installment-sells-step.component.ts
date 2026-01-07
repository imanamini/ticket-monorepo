import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ChequeOnBoardingResponse } from '../../../data-access/models/credit/activation/cheque-step/cheque-on-boarding.response';
import { Step } from '../../../data-access/models/credit/activation/step.model';
import { ActivationResponse } from '../../../data-access/models/credit/activation/activation-response.model';
import { CreditWallet } from '../../../data-access/models/credit/wallet/credit-wallet.model';
import { ConfigResponse } from '../../../data-access/models/credit/activation/config-response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { ONBOARDING } from './credit-installment-sells.data';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditCacheService } from '../../../data-access/services/credit-cache.service';
import { MessageService } from '../../../data-access/services/message.service';
import { INSTALLMENT_SELLS_STATUS_ENUM } from '../../../data-access/models/credit/activation/cheque-step/installment-sells-status.response';
import { CreditChequeNoticesBottomSheetComponent } from '../credit-cheque-notices-bottom-sheet/credit-cheque-notices-bottom-sheet.component';
import {
  CREDIT_CHEQUE_DOCUMENT_STATUS,
  CreditChequeDocument,
} from '../../../data-access/models/credit/activation/cheque-step/cheque-step-detail-response.model';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditChequeStepOnBoardingComponent } from '../cheque-step-states/credit-cheque-step-on-boarding/credit-cheque-step-on-boarding.component';
import { CreditChequeStepNoticesComponent } from '../cheque-step-states/credit-cheque-step-notices/credit-cheque-step-notices.component';
import { CreditChequeStepErrorComponent } from '../cheque-step-states/credit-cheque-step-error/credit-cheque-step-error.component';
import { CreditChequeStepSayadErrorComponent } from '../cheque-step-states/credit-cheque-step-sayad-error/credit-cheque-step-sayad-error.component';
import { CreditChequeStepSayadComponent } from '../cheque-step-states/credit-cheque-step-sayad/credit-cheque-step-sayad.component';
import { CreditChequeStepUploadNewComponent } from '../cheque-step-states/credit-cheque-step-upload-new/credit-cheque-step-upload-new.component';
import { CreditChequeStepReserveConfirmComponent } from '../cheque-step-states/credit-cheque-step-reserve-confirm/credit-cheque-step-reserve-confirm.component';
import { CreditChequeStepHomeUploadComponent } from '../cheque-step-states/credit-cheque-step-home-upload/credit-cheque-step-home-upload.component';
import { CreditChequeStepChequeIdComponent } from '../cheque-step-states/credit-cheque-step-cheque-id/credit-cheque-step-cheque-id.component';
import { CreditChequeStepGuideComponent } from '../cheque-step-states/credit-cheque-step-guide/credit-cheque-step-guide.component';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';

const SAYAD_CHECK_ERROR_CODE = 5330;
const SAYAD_NOT_MATCHED = 5381;

@Component({
  selector: 'app-credit-installment-sells-step',
  templateUrl: './credit-installment-sells-step.component.html',
  styleUrls: ['./credit-installment-sells-step.component.scss'],
  imports: [
    CreditChequeStepOnBoardingComponent,
    CreditChequeStepNoticesComponent,
    CreditChequeStepErrorComponent,
    CreditChequeStepSayadErrorComponent,
    CreditChequeStepSayadComponent,
    CreditChequeStepUploadNewComponent,
    CreditChequeStepReserveConfirmComponent,
    CreditChequeStepHomeUploadComponent,
    CreditChequeStepChequeIdComponent,
    CreditChequeStepGuideComponent,
    CreditPageLoadingComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditInstallmentSellsStepComponent implements OnInit {
  step = signal<Step | null>(null);

  activation!: ActivationResponse;

  wallet = signal<CreditWallet | null>(null);

  stepIndex!: number;

  states = [
    'ON_BOARDING',
    'PUBLIC_GUIDE',
    'NOTICES',
    'HOME_UPLOAD',
    'CHEQUE_ID',
    'GUIDE',
    'UPLOAD',
    'SAYAD',
    'ERROR',
    'SAYAD_ERROR',
    'RESERVE_CONFIRM',
  ];

  stateIndex = 0;

  config = signal<ConfigResponse | null>(null);

  showLoading = signal<boolean | null>(null);

  loadingApi = signal(false);

  fundProviderCode = signal<number | null>(null);

  creditId = signal<string | null>(null);

  skippedStepsList: { [key: number]: boolean } = {};

  onboardingData: ChequeOnBoardingResponse = ONBOARDING;

  chequeCount = signal<number | null>(null);

  chequeOrder = signal<number | null>(null);

  chequeId = signal<string | null>(null);

  cheque = signal<CreditChequeDocument | null>(null);

  sayadErrorAlertMessage = signal<string | undefined>(undefined);

  errorType!: 'notRegistered' | 'others' | '';

  chequeStatus = CREDIT_CHEQUE_DOCUMENT_STATUS;

  private bottomSheetService = inject(NgxBottomSheetService);
  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);
  private apiService = inject(CreditApiService);
  private cache = inject(CreditCacheService);
  private messageService = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const state = JSON.parse(sessionStorage.getItem('state')!);
    if (!state.step || !state.activationResponse) {
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
      return;
    }
    this.step.set(state.step);
    this.wallet.set(state.wallet);
    this.stepIndex = state.stepIndex;
    this.fundProviderCode.set(+this.activatedRoute.snapshot.params['fundProviderCode']);
    this.creditId.set(this.activatedRoute.snapshot.params['creditId']);

    this.getStatus();

    const ACTIVATION_CONFIG_CACHE = 'CREDIT_ACTIVATION_CONFIG_CACHE';
    if (this.cache.has(ACTIVATION_CONFIG_CACHE)) {
      this.config.set(this.cache.get(ACTIVATION_CONFIG_CACHE));
    } else {
      this.apiService.getActivationConfig().subscribe((r) => {
        this.config.set(r);
        this.cache.put(ACTIVATION_CONFIG_CACHE, r);
      });
    }

    if (this.cache.has('CHEQUE_ORDER')) {
      this.chequeOrder.set(this.cache.get('CHEQUE_ORDER'));
    }
  }

  goBack() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode()}/${this.creditId()}`),
    );
  }

  prevState() {
    if (this.stateIndex <= 2) {
      this.goBack();
      return;
    }
    this.stateIndex--;
    if (this.skippedStepsList[this.stateIndex]) {
      this.prevState();
    }
    this.getAndSetData();
  }

  nextState(skippedStep: any = false) {
    if (skippedStep) {
      this.skippedStepsList[this.stateIndex] = true;
    }
    if (this.stateIndex >= this.states.length - 1) {
      // finish
      return;
    }
    this.stateIndex++;
    if (this.states[this.stateIndex] === 'PUBLIC_GUIDE') {
      this.nextState();
    }
    if (this.skippedStepsList[this.stateIndex]) {
      this.nextState();
    }
    this.getAndSetData();
  }

  getAndSetData(): Promise<void> {
    return new Promise<void>((resolve) => {
      switch (this.stateIndex) {
        case 1:
          this.getOnBoardedData();
          break;
      }
      resolve();
    });
  }

  afterHomeUpload() {
    this.goToStep('RESERVE_CONFIRM');
    this.errorType = '';
  }

  getStatus() {
    this.showLoading.set(true);
    this.apiService.getInstallmentSellsStatus(this.creditId()!).subscribe({
      next: (result) => {
        switch (result.status) {
          case INSTALLMENT_SELLS_STATUS_ENUM.INITIATED:
            this.stateIndex = 0;
            break;
          case INSTALLMENT_SELLS_STATUS_ENUM.ONBOARDED:
            this.getOnBoardedData();
            this.stateIndex = 1;
            this.nextState();
            break;
          case INSTALLMENT_SELLS_STATUS_ENUM.GENERATED:
            this.stateIndex = 3;
            break;
          case INSTALLMENT_SELLS_STATUS_ENUM.UPLOADED:
            this.stateIndex = 10;
            break;
          case INSTALLMENT_SELLS_STATUS_ENUM.REJECTED:
            this.stateIndex = 3;
            break;
        }
        this.showLoading.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  getOnBoardedData() {
    this.showLoading.set(true);
    this.apiService.getInstallmentSellsOnBoarding(this.creditId()!).subscribe({
      next: (response) => {
        this.chequeCount.set(response.chequeCount);
        this.showLoading.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.nextState();
        this.showLoading.set(false);
      },
    });
  }

  goToRegister(cheque: CreditChequeDocument) {
    this.chequeOrder.set(cheque.order!);
    this.cache.put('CHEQUE_ORDER', cheque.order);
    if (cheque.status === this.chequeStatus.REJECTED) {
      this.stateIndex = 8;
      this.cheque.set(cheque);
    } else {
      this.stateIndex = 4;
    }
  }

  setChequeId(chequeId: string) {
    this.chequeId.set(chequeId);
  }

  closeStep() {
    this.goBack();
  }

  openNotices() {
    this.bottomSheetService.openBottomSheet(CreditChequeNoticesBottomSheetComponent, {}, { noPadding: true, height: '100%' });
  }

  goToStep(step: string) {
    this.stateIndex = this.states.indexOf(step);
  }

  setErrorType(errorType: 'notRegistered' | 'others' | '') {
    this.errorType = errorType;
  }

  uploadChequeConfirm(isOneCheque = false) {
    this.loadingApi.set(true);
    this.sayadErrorAlertMessage.set(undefined);
    if (this.errorType === 'notRegistered' || isOneCheque) {
      this.apiService.installmentSellsUploadConfirm(this.creditId()!, this.chequeOrder()!).subscribe({
        next: () => {
          this.goToStep('HOME_UPLOAD');
          this.loadingApi.set(false);
        },
        error: (error) => {
          this.loadingApi.set(false);
          if (error.result.status === SAYAD_CHECK_ERROR_CODE) {
            this.goToStep('SAYAD_ERROR');
          } else if (error.result.status === SAYAD_NOT_MATCHED) {
            this.goToStep('SAYAD_ERROR');
            this.sayadErrorAlertMessage.set(error.result.message);
          } else {
            this.messageService.showErrorOfErrorResponse(error);
          }
        },
      });
    } else {
      this.apiService.installmentSellsRegistered(this.creditId()!).subscribe({
        next: () => {
          this.loadingApi.set(false);
          this.router.navigateByUrl(
            this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode()}/${this.creditId()}/next`),
          );
        },
        error: (error) => {
          this.loadingApi.set(false);
          this.goBack();
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
    }
  }
}
