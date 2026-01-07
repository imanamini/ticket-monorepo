import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CreditScoringStepType } from '../services/credit-scoring-step.type';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../../data-access/services/message.service';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditScoringBlacklistComponent } from '../../credit-scoring-shared/credit-scoring-blacklist-check/credit-scoring-blacklist.component';
import { CsStepNoServiceMessageComponent } from '../../credit-scoring-shared/cs-step-no-service-message/cs-step-no-service-message.component';
import { CreditScoringStepService } from '../services/credit-scoring-step.service';
import { CreditScoringStepOnBoardingComponent } from '../credit-scoring-step-on-boarding/credit-scoring-step-on-boarding.component';
import { CreditScoringStepResultWrapperComponent } from '../credit-scoring-step-result-wrapper/credit-scoring-step-result-wrapper.component';
import { CreditScoringStepOtpComponent } from '../credit-scoring-step-otp/credit-scoring-step-otp.component';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditScoringWithoutPayConfigResponse } from '../../../data-access/models/credit-scoring/basic/credit-scoring-without-pay-config.response';
import { CREDIT_SCORING_STEP_STATUS } from '../../../data-access/models/credit-scoring/basic/credit-scoring-step-status';
import { SCORING_STATUS_CODE } from '../services/credit-scoring-step-status';
import { CreditScoringWhiteListStatusComponent } from '../credit-scoring-white-list-status/credit-scoring-white-list-status.component';
import { CreditScoringDpFailedComponent } from '../credit-scoring-dp-failed/credit-scoring-dp-failed.component';

@Component({
  selector: 'app-credit-scoring-step-control',
  templateUrl: './credit-scoring-step-control.component.html',
  styleUrls: ['./credit-scoring-step-control.component.scss'],
  standalone: true,
  imports: [
    CreditScoringBlacklistComponent,
    CsStepNoServiceMessageComponent,
    CreditScoringStepOnBoardingComponent,
    CreditScoringStepResultWrapperComponent,
    CreditScoringStepOtpComponent,
    CreditPageLoadingComponent,
    CreditScoringWhiteListStatusComponent,
    CreditScoringDpFailedComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringStepControlComponent implements OnInit {
  stepTypeEnum = CreditScoringStepType;

  creditId = signal<string | undefined>(undefined);
  fundProviderCode = signal<string | undefined>(undefined);

  activeStep = signal<CreditScoringStepType>(CreditScoringStepType.BLACKLIST_CHECK);
  showLoading = signal<boolean>(true);
  creditScoringConfig = signal<CreditScoringWithoutPayConfigResponse | undefined>(undefined);

  messageService = inject(MessageService);
  creditScoringStepService = inject(CreditScoringStepService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  creditUrlService = inject(CreditUrlService);

  needOtp = computed(() => !!this.creditScoringStepService.otpConfig()?.needOtp);

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    const queryParams = this.activatedRoute.snapshot.queryParams;
    const showResultPage = !!queryParams['offeredPlans'];

    this.creditId.set(params['creditId']);
    this.fundProviderCode.set(params['fundProviderCode']);

    if (!queryParams['continueFlow']) {
      this.activeStep.set(CreditScoringStepType.BLACKLIST_CHECK);
      this.creditScoringStepService.setCreditInfo(params['fundProviderCode'], params['creditId']);
    }

    if (showResultPage) {
      this.creditScoringStepService.setWaitingResult(false);
      this.setActiveStep(CreditScoringStepType.RESULT);
      this.showLoading.set(false);
      return;
    }
    this.getConfig();
  }

  setActiveStep(step: CreditScoringStepType) {
    this.activeStep.set(step);
  }

  checkNeedOTP() {
    if (this.needOtp()) {
      this.setActiveStep(CreditScoringStepType.OTP);
    } else {
      this.setActiveStep(CreditScoringStepType.RESULT);
    }
  }

  getConfig() {
    this.showLoading.set(true);
    this.creditScoringStepService.clearConfig();
    this.creditScoringStepService.getScoringConfig(this.creditId()!).subscribe({
      next: (response) => {
        this.creditScoringConfig.set(response);
        if (response.status === CREDIT_SCORING_STEP_STATUS.COMPLETED) {
          this.goToNextCreditStep();
          return;
        }
        if (response.status === CREDIT_SCORING_STEP_STATUS.GENERATE_REPORT_STARTED) {
          this.creditScoringStepService.setWaitingResult(true);
          this.setActiveStep(CreditScoringStepType.RESULT);
          this.showLoading.set(false);
          return;
        }
        if (response.status === CREDIT_SCORING_STEP_STATUS.FAILED) {
          this.creditScoringStepService.setErrorType('FAILED');
          this.setActiveStep(CreditScoringStepType.RESULT);
          this.showLoading.set(false);
          return;
        }
        if (response.status === CREDIT_SCORING_STEP_STATUS.SHAHKAR_FAILED) {
          this.creditScoringStepService.setErrorType('SHAHKAR_FAILED');
          this.setActiveStep(CreditScoringStepType.RESULT);
          this.showLoading.set(false);
          return;
        }
        if (response.status === CREDIT_SCORING_STEP_STATUS.BLACK_LIST) {
          this.setActiveStep(CreditScoringStepType.BLACKLIST_CHECK);
          this.showLoading.set(false);
          return;
        }
        this.setActiveStep(CreditScoringStepType.ON_BOARDING);
        this.showLoading.set(false);
      },
      error: (error) => {
        if (error?.result?.status === SCORING_STATUS_CODE.SHAHKAR_FAILED) {
          this.creditScoringStepService.setErrorType('SHAHKAR_FAILED');
          this.setActiveStep(CreditScoringStepType.RESULT);
          this.showLoading.set(false);
          return;
        }
        if ([SCORING_STATUS_CODE.SERVICE_ERROR, SCORING_STATUS_CODE.NO_SERVICE].includes(error?.result?.status)) {
          this.handleOnboardError(error);
          return;
        }
        this.handleConfigError(error);
      },
    });
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
            this.creditScoringStepService.closeFlow();
          }
        });
      return;
    }
  }

  handleOnboardError(error: any) {
    if (error && error.result) {
      if (error.result.status === SCORING_STATUS_CODE.NO_SERVICE || error.result.status === SCORING_STATUS_CODE.SERVICE_ERROR) {
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
              this.getConfig();
              return;
            }
            this.creditScoringStepService.goToCreditHome('overview');
          });
        this.showLoading.set(false);
        return;
      }
    }
    this.messageService.showErrorOfErrorResponse(error);
    this.creditScoringStepService.goToCreditHome('overview');
  }

  goToNextCreditStep() {
    this.creditScoringStepService.goToNextCreditStep();
  }

  backToStepper() {
    this.creditScoringStepService.closeFlow();
  }
}
