import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CreditUrlService } from '../../../data-access/utils/url';
import { ActivatedRoute, Router } from '@angular/router';
import { Step } from '../../../data-access/models/credit/activation/step.model';
import { ConfigResponse } from '../../../data-access/models/credit/activation/config-response.model';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditChequeStepService } from '../services/credit-cheque-step.service';
import { CreditChequeStepInterface } from '../services/credit-cheque-step.interface';
import { CreditCacheService } from '../../../data-access/services/credit-cache.service';
import { CreditWallet } from '../../../data-access/models/credit/wallet/credit-wallet.model';
import { ChequeOnBoardingResponse } from '../../../data-access/models/credit/activation/cheque-step/cheque-on-boarding.response';
import { CreditChequeStepChequeIdModel } from '../cheque-step-states/credit-cheque-step-cheque-id/credit-cheque-step-cheque-id-form.model';
import { CreditChequeDocument } from '../../../data-access/models/credit/activation/cheque-step/cheque-step-detail-response.model';
import { CreditChequeStepOnBoardingComponent } from '../cheque-step-states/credit-cheque-step-on-boarding/credit-cheque-step-on-boarding.component';
import { CreditChequeSelectStepFlowComponent } from '../cheque-step-states/credit-cheque-select-step-flow/credit-cheque-select-step-flow.component';
import { CreditChequeStepChequeIdComponent } from '../cheque-step-states/credit-cheque-step-cheque-id/credit-cheque-step-cheque-id.component';
import { CreditChequeStepFormComponent } from '../cheque-step-states/credit-cheque-step-form/credit-cheque-step-form.component';
import { CreditChequeStepOwnerFormComponent } from '../cheque-step-states/credit-cheque-step-owner-form/credit-cheque-step-owner-form.component';
import { CreditChequeStepSayadComponent } from '../cheque-step-states/credit-cheque-step-sayad/credit-cheque-step-sayad.component';
import { CreditChequeStepUploadNewComponent } from '../cheque-step-states/credit-cheque-step-upload-new/credit-cheque-step-upload-new.component';
import { CreditChequeStepErrorComponent } from '../cheque-step-states/credit-cheque-step-error/credit-cheque-step-error.component';
import { CreditChequeStepSayadErrorComponent } from '../cheque-step-states/credit-cheque-step-sayad-error/credit-cheque-step-sayad-error.component';
import { CreditChequeStepGuideComponent } from '../cheque-step-states/credit-cheque-step-guide/credit-cheque-step-guide.component';
import { ChequeStatus } from '../../../data-access/models/credit/activation/cheque-step/cheque-status-response';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditChequeStepSendComponent } from '../cheque-step-states/credit-cheque-step-send/credit-cheque-step-send.component';
import { CreditChequeDeliveryStepsComponent } from '../cheque-step-states/credit-cheque-delivery-steps/credit-cheque-delivery-steps.component';
import { ChequeDeliveryData } from '../../../data-access/models/credit/activation/cheque-step/cheque-step-delivery.model';
import { CreditChequeStepReadyToProcessComponent } from '../cheque-step-states/credit-cheque-step-ready-to-process/credit-cheque-step-ready-to-process.component';

const SAYAD_NOT_SUBMITTED = 5330;
const SAYAD_NOT_MATCHED = 5381;

@Component({
  selector: 'app-credit-cheque-step',
  templateUrl: './credit-cheque-step.component.html',
  styleUrls: ['./credit-cheque-step.component.scss'],
  imports: [
    CreditChequeStepOnBoardingComponent,
    CreditChequeSelectStepFlowComponent,
    CreditChequeStepChequeIdComponent,
    CreditChequeStepFormComponent,
    CreditChequeStepOwnerFormComponent,
    CreditChequeStepSayadComponent,
    CreditChequeStepUploadNewComponent,
    CreditChequeStepErrorComponent,
    CreditChequeStepSayadErrorComponent,
    CreditChequeStepGuideComponent,
    CreditPageLoadingComponent,
    CreditChequeStepSendComponent,
    CreditChequeDeliveryStepsComponent,
    CreditChequeStepReadyToProcessComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepComponent implements OnInit {
  step = signal<Step | null>(null);

  wallet = signal<CreditWallet | null>(null);

  stepIndex!: number;

  states = [
    'ON_BOARDING',
    'STEP_FLOW',
    'CHEQUE_ID',
    'FORM',
    'GUIDE',
    'SAYAD',
    'UPLOAD',
    'SAYAD_ERROR',
    'ERROR',
    'READY_TO_PROCESS',
    'SEND_CHEQUE',
    'CHEQUE_DELIVERY',
  ];

  stateIndex = signal(0);

  showInfo = signal<boolean>(false);

  config = signal<ConfigResponse | null>(null);

  showLoading = signal<boolean | null>(null);

  fundProviderCode = signal<number | null>(null);

  creditId = signal<string | undefined>(undefined);

  skippedStepsList: { [key: number]: boolean } = {};

  onboardingData = signal<ChequeOnBoardingResponse | null>(null);

  cheque = signal<CreditChequeDocument | null>(null);
  chequeId = signal<string | null>(null);
  pickupLink = signal('');
  sayadErrorAlertMessage = signal<string | undefined>(undefined);
  chequeStatus = signal<ChequeStatus | undefined>(undefined);
  chequeDeliveryData = signal<ChequeDeliveryData | undefined>(undefined);

  private router = inject(Router);
  private cache = inject(CreditCacheService);
  private apiService = inject(CreditApiService);
  private creditChequeStepService = inject(CreditChequeStepService);
  private creditUrlService = inject(CreditUrlService);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    const state = JSON.parse(sessionStorage.getItem('state')!);
    if (!state?.step || !state.activationResponse) {
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
      return;
    }
    this.step.set(state.step);
    this.wallet.set(state.wallet);
    this.stepIndex = state.stepIndex;
    this.fundProviderCode.set(+this.activatedRoute.snapshot.params['fundProviderCode']);
    this.creditId.set(this.activatedRoute.snapshot.params['creditId']);

    this.showLoading.set(true);
    Promise.all([this.getAndSetData('init')]).then();

    // Get config once and cache it for later
    const ACTIVATION_CONFIG_CACHE = 'CREDIT_ACTIVATION_CONFIG_CACHE';
    if (this.cache.has(ACTIVATION_CONFIG_CACHE)) {
      this.config.set(this.cache.get(ACTIVATION_CONFIG_CACHE));
    } else {
      this.apiService.getActivationConfig().subscribe((r) => {
        this.config.set(r);
        this.cache.put(ACTIVATION_CONFIG_CACHE, r);
      });
    }
  }

  getAndSetData(methodType: 'init' | 'reload'): Promise<void> {
    return new Promise<void>((resolve) => {
      this.apiService.getChequeStepDetail(this.fundProviderCode()!, this.creditId()!).subscribe((response) => {
        const data: CreditChequeStepInterface = {};
        if (methodType === 'reload') {
          this.creditChequeStepService.documents.next(response.documents ? response.documents : []);
          this.showLoading.set(false);
        } else {
          this.chequeId.set(response.chequeId);
          // cheque info
          data.date = response.date ? response.date : 1659358371000;
          data.iban = response.iban ? response.iban : null!;
          data.amount = response.amount ? response.amount : 13500000;
          data.ownerName = response.ownerName ? response.ownerName : null!;
          data.chequeId = response.chequeId ? response.chequeId : null!;
          data.bankName = response.bankName ? response.bankName : null!;

          // cheque owner info
          data.ownerName = response.ownerName || null!;
          data.ownerRelative = response.ownerRelative || null!;
          data.ownerNationalCode = response.ownerNationalCode || null!;
          data.ownerBirthDate = response.ownerBirthDate || null!;
          data.ownerCellNumber = response.ownerCellNumber || null!;
          if (response.relatives) {
            this.creditChequeStepService.relationList.next(response.relatives);
          }
          this.creditChequeStepService.documents.next(response.documents ? response.documents : []);
          this.creditChequeStepService.setData(data);
          this.getChequeStatus();
        }
        if (response.documents && response.documents.length && response.documents[0].reasons?.length) {
          this.cheque.set(response.documents[0]);
        }
        resolve();
      });
    });
  }

  getChequeStatus() {
    this.showLoading.set(true);
    this.apiService.getChequeStatus(this.creditId()!).subscribe({
      next: (response) => {
        this.chequeStatus.set(response.chequeStatus);
        this.chequeDeliveryData.set(response.chequeDeliveryData);
        this.getOnboardingData();

        switch (this.chequeStatus()) {
          case ChequeStatus.READY_TO_PROCESS:
            this.gotoState('READY_TO_PROCESS');
            this.showLoading.set(false);
            break;

          case ChequeStatus.IMAGE_REJECTED:
          case ChequeStatus.PHYSICS_REJECTED:
            this.goToState('ERROR');
            this.showLoading.set(false);
            break;

          case ChequeStatus.IMAGE_ACCEPTED:
            this.pickupLink.set(response.pickupLink);
            this.goToState('SEND_CHEQUE');
            this.showLoading.set(false);
            break;

          case ChequeStatus.COMPLETED:
            this.goBack();
            break;

          case ChequeStatus.PHYSICS_RECEIVED:
          case ChequeStatus.PHYSICS_DELIVERY_RESERVED:
          case ChequeStatus.PHYSICS_DELIVERY_HANDLED:
            this.goToState('CHEQUE_DELIVERY');
            this.showLoading.set(false);
            break;

          default:
            this.goToState('ON_BOARDING');
            this.showLoading.set(false);
        }
      },
    });
  }

  goToState(state: string) {
    const stateIndex = this.states.indexOf(state);
    this.stateIndex.set(stateIndex);
  }

  getOnboardingData() {
    this.showLoading.set(true);
    this.apiService.getChequeOnBoarding(this.creditId()!).subscribe({
      next: (response) => {
        this.onboardingData.set(response);
        // this.showLoading.set(false);
      },
      error: () => {
        this.nextState();
        this.showLoading.set(false);
      },
    });
  }

  goBack() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode()}/${this.creditId()}`),
    );
  }

  reload() {
    this.getAndSetData('reload');
  }

  submitFormData() {
    this.showLoading.set(true);
    const ownerFormStateIndex = this.states.indexOf('FORM');
    this.skippedStepsList[ownerFormStateIndex] = !+this.creditChequeStepService.data.ownerRelative!;
    this.apiService.sendChequeData(this.fundProviderCode()!, this.creditId()!, this.creditChequeStepService.data).subscribe({
      next: (response) => {
        this.creditChequeStepService.ownerKycData = {
          ownerName: response.ownerName,
          ownerBirthCertificate: response.ownerBirthCertificate,
        };
        this.nextState();
        this.showLoading.set(false);
      },
      error: (error) => {
        this.creditChequeStepService.handleError(error);
        this.showLoading.set(false);
      },
    });
  }

  onSubmit() {
    this.sayadErrorAlertMessage.set(undefined);
    this.showLoading.set(true);
    this.apiService.chequesConfirm(this.fundProviderCode()!, this.creditId()!).subscribe({
      next: () => {
        this.showLoading.set(false);
        this.router.navigateByUrl(
          this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode()}/${this.creditId()}`),
        );
      },
      error: (error) => {
        this.showLoading.set(false);
        if (error && error.result && (error.result.status === SAYAD_NOT_SUBMITTED || error.result.status === SAYAD_NOT_MATCHED)) {
          const errorIndex = this.states.indexOf('SAYAD_ERROR');
          this.stateIndex.set(errorIndex);
          if (error.result.status === SAYAD_NOT_MATCHED) {
            this.sayadErrorAlertMessage.set(error.result.message);
          }
          return;
        }
        this.creditChequeStepService.handleError(error);
      },
    });
  }

  prevState() {
    if (this.stateIndex() <= 0) {
      this.goBack();
      return;
    }
    this.stateIndex.update((value) => value - 1);
    if (this.skippedStepsList[this.stateIndex()]) {
      this.prevState();
    }
  }

  setChequeOwnerInfo(info: CreditChequeStepChequeIdModel) {
    this.creditChequeStepService.data.chequeId = info.chequeId;
    this.creditChequeStepService.data.ownerRelative = +info.ownerRelative;
    if (+info.ownerRelative) {
      this.nextState();
    } else {
      this.submitFormData();
    }
  }

  nextState(skippedStep: any = false) {
    if (skippedStep) {
      this.skippedStepsList[this.stateIndex()] = true;
    }
    if (this.stateIndex() >= this.states.length - 1) {
      // finish
      return;
    }
    this.stateIndex.update((value) => value + 1);
    if (this.skippedStepsList[this.stateIndex()]) {
      this.nextState();
    }
  }

  gotoState(state: string) {
    this.stateIndex.set(this.states.indexOf(state));
  }
}
