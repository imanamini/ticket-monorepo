import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { GenerateDigitalSignatureStepStatus } from '../../../data-access/models/credit/activation/generate-digital-signature-step/generate-digital-signature-step-status';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import {
  CreditGenerateDigitalSignatureService,
  GenerateDigitalSignatureErrorTypes,
} from '../services/credit-generate-digital-signature.service';
import {
  DigitalSignatureStepperUrl,
  GeneralDigitalSignatureSteps,
  RESPONSE_ERROR_STATUS,
  STEPS,
} from './general-digital-signature-steps.model';
import { CreditGenerateDigitalSignatureOnBoardingComponent } from '../credit-generate-digital-signature-on-boarding/credit-generate-digital-signature-on-boarding.component';
import { CreditGenerateDigitalSignaturePasswordExpiredComponent } from '../credit-generate-digital-signature-password/credit-generate-digital-signature-password-expired/credit-generate-digital-signature-password-expired.component';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditGenerateDigitalSignatureExistComponent } from '../credit-generate-digital-signature-exist/credit-generate-digital-signature-exist.component';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-generate-digital-signature-step',
  templateUrl: './credit-generate-digital-signature-step.component.html',
  styleUrls: ['./credit-generate-digital-signature-step.component.scss'],
  imports: [
    CreditGenerateDigitalSignatureOnBoardingComponent,
    CreditGenerateDigitalSignatureExistComponent,
    CreditGenerateDigitalSignaturePasswordExpiredComponent,
    NgxIcon,
    NgxTrackableIdDirective,
    CreditPageLoadingComponent,
    CreditScrollableViewComponent,
    CreditAppBarComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureStepComponent implements OnInit, OnDestroy {
  fundProviderCode = signal<number | undefined>(undefined);
  creditId = signal<string | undefined>(undefined);
  showLoading = signal<boolean>(false);
  showOnBoarding = signal<boolean>(false);
  showSignatureExist = signal<boolean>(false);
  signatureExpired = signal<boolean>(false);
  activeState = signal<GenerateDigitalSignatureStepStatus | null>(null);
  errorType = signal<GenerateDigitalSignatureErrorTypes | null>(null);

  steps = GeneralDigitalSignatureSteps;
  autoNavigation = computed(() => this.creditGenerateDigitalSignatureService.digitalSignatureAutoNavigation());

  private activatedRoute = inject(ActivatedRoute);
  private creditApiService = inject(CreditApiService);
  private creditUrlService = inject(CreditUrlService);
  private router = inject(Router);
  private creditGenerateDigitalSignatureService = inject(CreditGenerateDigitalSignatureService);

  ngOnInit(): void {
    this.fundProviderCode.set(+this.activatedRoute.snapshot.params['fundProviderCode']);
    this.creditId.set(this.activatedRoute.snapshot.params['creditId']);
    this.getStatus();
    this.creditGenerateDigitalSignatureService.errorType.subscribe((errorType) => {
      this.errorType.set(errorType);
    });
  }

  ngOnDestroy(): void {
    this.creditGenerateDigitalSignatureService.errorType.next(null);
  }

  closeStep() {
    this.errorType.set(null);
    this.backToCreditStepper();
  }

  visitOnBoarding(): void {
    this.activeState.set(GenerateDigitalSignatureStepStatus.ONBOARDED);
    this.goToCurrentStep();
    setTimeout(() => {
      this.showOnBoarding.set(false);
    }, 0);
  }

  getStatus(): void {
    this.showSignatureExist.set(false);
    this.signatureExpired.set(false);
    this.showLoading.set(true);
    this.creditApiService.getDigitalSignatureGenerationStatus(this.creditId()!).subscribe({
      next: (response) => {
        this.showLoading.set(false);
        this.activeState.set(response.status);
        if (response.status === GenerateDigitalSignatureStepStatus.READY_TO_GENERATION) {
          this.activeState.set(GenerateDigitalSignatureStepStatus.VIDEO_UPLOADED);
        }
        if (
          response.status === GenerateDigitalSignatureStepStatus.INITIATED ||
          response.status === GenerateDigitalSignatureStepStatus.IN_PROGRESS
        ) {
          this.showLoading.set(true);
          this.checkUserHasSignature();
          return;
        }
        if (response.status === GenerateDigitalSignatureStepStatus.EXPIRED) {
          this.goToExpiredToken();
          return;
        }
        this.goToCurrentStep();
      },
      error: (error) => {
        if (error && error.result && error.result.status === RESPONSE_ERROR_STATUS.NATIVE_LIVENESS_MAX_TRY) {
          this.goToExpiredToken();
          return;
        }
        this.backToCreditStepper();
        this.creditGenerateDigitalSignatureService.handleError(error);
        this.showLoading.set(false);
      },
    });
  }

  checkUserHasSignature() {
    this.creditApiService.getUserHasSignature().subscribe({
      next: (response) => {
        this.showLoading.set(false);
        this.showOnBoarding.set(false);
        if (response.remainingDays > 0) {
          sessionStorage.setItem('_digitalSignatureRemainingDays', response.remainingDays.toString());
          this.showSignatureExist.set(true);
        } else {
          this.signatureExpired.set(true);
          sessionStorage.removeItem('_digitalSignatureRemainingDays');
        }
      },
      error: (error) => {
        this.showLoading.set(false);
        sessionStorage.removeItem('_digitalSignatureRemainingDays');
        if (error && error.originalResponseCode === 'DIGITAL_SIGNATURE_NOT_FOUND') {
          this.creditGenerateDigitalSignatureService.setDigitalSignatureAutoNavigation(true);
          this.showOnBoarding.set(true);
        } else {
          this.creditGenerateDigitalSignatureService.handleError(error);
        }
      },
    });
  }

  goToPasswordValidation() {
    this.showSignatureExist.set(false);
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(
        `${DigitalSignatureStepperUrl + this.fundProviderCode()}/${this.creditId()}/${STEPS.GENERATE_PASSWORD}?validation=true`,
      ),
    );
  }

  goToCurrentStep() {
    if (!this.autoNavigation()) {
      return;
    }
    this.creditGenerateDigitalSignatureService.setDigitalSignatureAutoNavigation(false);
    const nextStep = this.steps.find((step) => step.status === this.activeState())?.url;
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`${DigitalSignatureStepperUrl + this.fundProviderCode()}/${this.creditId()}/${nextStep}`),
    );
  }

  backToCreditStepper() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode()}/${this.creditId()}`),
    );
  }

  goToExpiredToken() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`${DigitalSignatureStepperUrl + this.fundProviderCode()}/${this.creditId()}/token-expired`),
    );
  }

  goToStep(url: string) {
    this.router.navigate([url], { relativeTo: this.activatedRoute });
  }
}
