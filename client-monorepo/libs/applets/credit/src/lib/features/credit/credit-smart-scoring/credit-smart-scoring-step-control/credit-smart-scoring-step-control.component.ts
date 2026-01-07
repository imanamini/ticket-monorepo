import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CreditSmartScoringStatus } from '../services/credit-smart-scoring.status';
import { ActivatedRoute, Router } from '@angular/router';
import { SMART_SCORING_STATUS_CODE } from '../services/credit-smart-scoring-step-status';
import { CreditSmartScoringStepOtpComponent } from '../credit-smart-scoring-step-otp/credit-smart-scoring-step-otp.component';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CsStepNoServiceMessageComponent } from '../../wallet-activation/credit-scoring-shared/cs-step-no-service-message/cs-step-no-service-message.component';
import { CreditUrlService } from '../../data-access/utils/url';
import { MessageService } from '../../data-access/services/message.service';
import { CreditSmartScoringPreSignupFormComponent } from '../credit-smart-scoring-pre-signup-form/credit-smart-scoring-pre-signup-form.component';
import { CreditSmartScoringStepService } from '../services/credit-smart-scoring-step.service';
import { CreditSmartScoringConfigResponse } from '../../data-access/models/credit-smart-scoring/credit-smart-scoring-config.response';
import { CreditTacService } from '../../wallet-activation/credit-tac.service';
import { CreditSmartScoringNoAvailablePlanComponent } from '../credit-smart-scoring-no-available-plan/credit-smart-scoring-no-available-plan.component';
import { CreditNavigationService } from '../../data-access/services/credit-navigation.service';
import { CreditSmartScoringOngoingPlan } from '../../data-access/models/credit-smart-scoring/credit-smart-scoring-ongoing.plan';
import { CreditSmartScoreOnboardingComponent } from '../credit-smart-score-onboarding/credit-smart-score-onboarding.component';
import { CreditSmartScoringErrorComponent } from '../credit-smart-scoring-error/credit-smart-scoring-error.component';
import { CreditSmartScoringResultComponent } from '../credit-smart-scoring-result/credit-smart-scoring-result.component';
import { CreditSmartScoringStepReportWrapperComponent } from '../credit-smart-scoring-step-report-wrapper/credit-smart-scoring-step-report-wrapper.component';
import { CreditSmartScoringStepResultInProgressComponent } from '../credit-smart-scoring-step-result-in-progress/credit-smart-scoring-step-result-in-progress.component';
import { CreditSmartScoringStepInitComponent } from '../credit-smart-score-init/credit-smart-scoring-step-init.component';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { UserType } from '../../data-access/models/credit-smart-scoring/pre-signup-request.payload';
import { CreditServiceTypeService } from '../../data-access/services/credit-service-type.service';

@Component({
  selector: 'app-credit-smart-scoring-step-control',
  templateUrl: './credit-smart-scoring-step-control.component.html',
  styleUrls: ['./credit-smart-scoring-step-control.component.scss'],
  standalone: true,
  imports: [
    CsStepNoServiceMessageComponent,
    CreditPageLoadingComponent,
    CreditSmartScoringStepOtpComponent,
    CreditPageLoadingComponent,
    CreditSmartScoringPreSignupFormComponent,
    CreditSmartScoringNoAvailablePlanComponent,
    CreditSmartScoreOnboardingComponent,
    CreditSmartScoringErrorComponent,
    CreditSmartScoringResultComponent,
    CreditSmartScoringStepReportWrapperComponent,
    CreditSmartScoringStepResultInProgressComponent,
    CreditSmartScoringStepInitComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSmartScoringStepControlComponent implements OnInit {
  stepTypeEnum = CreditSmartScoringStatus;

  activeStep = signal<CreditSmartScoringStatus>(CreditSmartScoringStatus.INITIATED);
  showLoading = signal<boolean>(true);
  creditScoringConfig = signal<CreditSmartScoringConfigResponse | undefined>(undefined);
  showOnboardingBottomSheet = signal(false);
  ongoingPlanDetails = signal<CreditSmartScoringOngoingPlan | undefined>(undefined);

  messageService = inject(MessageService);
  creditSmartScoringStepService = inject(CreditSmartScoringStepService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  creditUrlService = inject(CreditUrlService);
  creditTacService = inject(CreditTacService);
  creditNavigationService = inject(CreditNavigationService);
  creditApiService = inject(CreditApiService);
  private creditServiceTypeService = inject(CreditServiceTypeService);

  status = computed(() => this.creditScoringConfig()?.status);
  maxCreditAmount = computed(() =>
    Math.max(this.creditScoringConfig()?.locCheque || 0, this.creditScoringConfig()?.locPromissoryNote || 0),
  );
  expirationDate = computed(() => this.creditScoringConfig()?.expirationDate);
  trackingCode = computed(() => this.creditScoringConfig()?.icsTrackingCode);

  ngOnInit(): void {
    if (this.creditServiceTypeService.isBnpl()) {
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/select-plan`)).then();
      return;
    }
    this.creditSmartScoringStepService.setUserType(this.activatedRoute.snapshot.queryParams['userType'] ?? UserType.APP);
    this.getStatus(true);
  }

  setActiveStep(step: CreditSmartScoringStatus) {
    this.activeStep.set(step);
  }

  getStatus(waitingForResult = false, enablePreSignUp = true) {
    this.showLoading.set(true);
    this.creditSmartScoringStepService.clearConfig();
    this.creditSmartScoringStepService.getSmartScoringStatus().subscribe({
      next: async (response) => {
        this.creditScoringConfig.set(response);
        this.ongoingPlanDetails.set(response.ongoingPlanDetails);
        if (response.hasPreSignUp === false) {
          this.initPreSignup();
          return;
        }
        if (response.status === CreditSmartScoringStatus.FAILED && response.failedReasonCode != null) {
          if (
            enablePreSignUp &&
            [
              SMART_SCORING_STATUS_CODE.USER_HAVE_ACTIVE_PLAN,
              SMART_SCORING_STATUS_CODE.USER_HAVE_ON_GOING_PLAN,
              SMART_SCORING_STATUS_CODE.USER_IS_DECEASED,
            ].includes(response.failedReasonCode)
          ) {
            this.activeStep.set(CreditSmartScoringStatus.ON_BOARDED);
          } else {
            this.creditSmartScoringStepService.setErrorType(response.failedReasonCode);
            this.activeStep.set(CreditSmartScoringStatus.FAILED);
          }
          this.showLoading.set(false);
          return;
        }
        if (response.status === CreditSmartScoringStatus.IN_BLACKLIST) {
          this.creditSmartScoringStepService.setErrorType(SMART_SCORING_STATUS_CODE.USER_IN_BLACKLIST);
          this.activeStep.set(CreditSmartScoringStatus.FAILED);
          this.showLoading.set(false);
          return;
        }

        if (response.status === CreditSmartScoringStatus.IN_WHITELIST) {
          this.checkAvailablePlans();
          return;
        }

        if (response.status === CreditSmartScoringStatus.ON_BOARDED) {
          this.setActiveStep(CreditSmartScoringStatus.ON_BOARDED);
          this.showLoading.set(false);
          return;
        }

        if (response.status === CreditSmartScoringStatus.IN_PROGRESS) {
          this.activeStep.set(response.status);
          if (await this.checkUserShouldAcceptTac()) {
            this.goToTac();
            return;
          }
          this.showLoading.set(false);
          return;
        }

        if (response.status === CreditSmartScoringStatus.GENERATE_REPORT_STARTED) {
          this.creditSmartScoringStepService.setWaitingResult(waitingForResult);
          this.activeStep.set(response.status);
          this.showLoading.set(false);
          return;
        }

        if ([CreditSmartScoringStatus.COMPLETED, CreditSmartScoringStatus.REJECTED].includes(response.status)) {
          this.activeStep.set(CreditSmartScoringStatus.RESULT);
          this.showLoading.set(false);
          this.sendEvent(response.status);
          return;
        }

        this.setActiveStep(CreditSmartScoringStatus.INITIATED);
        this.showLoading.set(false);
      },
      error: (error) => {
        if (error.result.status === SMART_SCORING_STATUS_CODE.PRE_SIGN_UP_DOES_NOT_EXIST) {
          this.initPreSignup();
          return;
        }
        if ([SMART_SCORING_STATUS_CODE.SERVICE_ERROR, SMART_SCORING_STATUS_CODE.NO_SERVICE].includes(error?.result?.status)) {
          this.handleOnboardError(error);
          return;
        }
        this.handleConfigError(error);
      },
    });
  }

  initPreSignup() {
    this.creditSmartScoringStepService.initSmartScoringConfig().subscribe({
      next: () => {
        this.showOnboardingBottomSheet.set(true);
        this.getStatus(true);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.goToOverview();
      },
    });
  }

  checkUserShouldAcceptTac() {
    return new Promise((resolve) => {
      this.creditTacService.getData().subscribe((tacResponse) => {
        resolve(tacResponse.shouldAccept);
      });
    });
  }

  goToTac() {
    const userType = this.creditSmartScoringStepService.getUserType();
    this.router
      .navigateByUrl(this.creditUrlService.getInnerServicePath('/wallet/tac'), {
        state: {
          destination: this.creditUrlService.getInnerServicePath(`/pre-register?userType=${userType}`),
        },
      })
      .then();
  }

  handleConfigError(error: any) {
    if (this.messageService.isNoServiceError(error)) {
      this.messageService
        .showBlockedError({
          title: 'اشکال در اتصال به سرویس‌دهنده',
          message: 'در حال‌حاضر سرویس‌دهنده در دسترس نیست. لطفاً برای ادامه فرآیند دقایقی دیگر دوباره تلاش کنید.',
          staticImage: 'no-service',
          primaryCta: 'بازگشت به خانه',
          secondaryCta: '',
        })
        .then((result) => {
          if (result.primary) {
            this.goToOverview();
          }
        });
      return;
    }
  }

  handleOnboardError(error: any) {
    if (error && error.result) {
      if (error.result.status === SMART_SCORING_STATUS_CODE.NO_SERVICE || error.result.status === SMART_SCORING_STATUS_CODE.SERVICE_ERROR) {
        this.messageService
          .showBlockedError({
            title: 'سرویس امکان‌سنجی در دسترس نیست',
            message: 'در حال حاضر سرویس امکان‌سنجی در دسترس نیست. لطفا برای ادامه فرایند دقایقی دیگر دوباره تلاش کنید.',
            staticImage: 'no-service',
            primaryCta: 'تلاش مجدد',
            secondaryCta: 'بستن',
          })
          .then((result) => {
            if (result.primary) {
              this.getStatus();
              return;
            }
            this.creditSmartScoringStepService.goToCreditHome('overview');
          });
        this.showLoading.set(false);
        return;
      }
    }
    this.messageService.showErrorOfErrorResponse(error);
    this.creditSmartScoringStepService.goToCreditHome('overview');
  }

  showPlans() {
    if (this.status() === this.stepTypeEnum.COMPLETED) {
      this.checkAvailablePlans();
      return;
    }
    if (this.status() === this.stepTypeEnum.REJECTED) {
      this.activeStep.set(this.stepTypeEnum.NO_AVAILABLE_PLAN);
      return;
    }
  }

  checkAvailablePlans() {
    this.showLoading.set(true);
    const userType = this.creditSmartScoringStepService.getUserType();
    this.creditApiService.getSmartScorePlans(userType).subscribe({
      next: (response) => {
        if (response.planGroupDetails.length) {
          this.goToSelectPlan();
        } else {
          this.activeStep.set(this.stepTypeEnum.NO_AVAILABLE_PLAN);
          this.showLoading.set(false);
        }
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.showLoading.set(false);
      },
    });
  }

  sendEvent(status: CreditSmartScoringStatus) {
    this.creditSmartScoringStepService
      .sendEvent(status === CreditSmartScoringStatus.REJECTED ? 'CREDIT_SCORING_FAILED' : 'CREDIT_SCORING_SUCCESS')
      .then();
  }

  goToSelectPlan() {
    const userType = this.creditSmartScoringStepService.getUserType();
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/select-plan?smartScore=true&userType=${userType}`)).then();
  }

  goToOverview() {
    this.creditSmartScoringStepService.goToCreditHome('overview');
  }

  closeService() {
    this.creditNavigationService.closeService();
  }
}
