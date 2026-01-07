import { ChangeDetectionStrategy, Component, Inject, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CreditScoringSmcApiService } from '../../../data-access/services/credit-scoring-smc-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CREDIT_SCORING_SMC_STATUS } from '../../../data-access/models/credit/smc-score/credit-scoring-smc-status';
import { MessageService } from '../../../data-access/services/message.service';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditScoringSmcStepInProgressComponent } from '../credit-scoring-smc-step-in-progress/credit-scoring-smc-step-in-progress.component';
import { CreditScoringSmcStepOtpComponent } from '../credit-scoring-smc-step-otp/credit-scoring-smc-step-otp.component';
import { CreditScoringSmcResultPageComponent } from '../credit-scoring-smc-result-page/credit-scoring-smc-result-page.component';
import { CreditScoringSmcUnreadyReportComponent } from '../credit-scoring-smc-unready-report/credit-scoring-smc-unready-report.component';
import { CreditScoringSmcStepSuccessPageComponent } from '../credit-scoring-smc-step-success-page/credit-scoring-smc-step-success-page.component';
import { CreditScoringBlacklistComponent } from '../../credit-scoring-shared/credit-scoring-blacklist-check/credit-scoring-blacklist.component';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { CreditUserService } from '../../../data-access/services/credit-user.service';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../../credit-environment.interface';

type StatusType = CREDIT_SCORING_SMC_STATUS | 'UNREADY' | 'SHAHKAR_FAILED' | null;

@Component({
  selector: 'app-credit-scoring-smc-step',
  standalone: true,
  imports: [
    CreditScoringSmcStepInProgressComponent,
    CreditScoringSmcStepOtpComponent,
    CreditScoringSmcResultPageComponent,
    CreditScoringSmcUnreadyReportComponent,
    CreditScoringSmcStepSuccessPageComponent,
    CreditScoringBlacklistComponent,
    CreditPageLoadingComponent,
  ],
  templateUrl: './credit-scoring-smc-step.component.html',
  styleUrl: './credit-scoring-smc-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringSmcStepComponent implements OnInit, OnDestroy {
  creditScoringSmcApiService = inject(CreditScoringSmcApiService);
  activatedRoute = inject(ActivatedRoute);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  creditUrlService = inject(CreditUrlService);
  gtmService = inject(NgxEventTrackerService);
  creditUserService = inject(CreditUserService);

  constructor(
    @Inject(CREDIT_ENVIRONMENT)
    private creditEnvironment: CreditEnvironmentInterface,
  ) {}
  isBlackList = signal<boolean>(false);
  private InProgressTimeout?: ReturnType<typeof setTimeout>;
  private readonly ERROR_CODES = {
    BLACKLIST: 5327,
    SERVICE_UNAVAILABLE: [1118, 16502, 1000],
  };
  fundProviderCode = signal<number | null>(null);
  creditId = signal<string | null>(null);
  showLoading = signal<boolean>(false);
  status = signal<StatusType>(null);
  creditAmount = signal<number | null>(null);
  CREDIT_SCORING_SMC_STATUS = CREDIT_SCORING_SMC_STATUS;

  ngOnInit(): void {
    this.initializeRouteParams();
    this.getStatus();
    this.sendGtmEvent();
  }

  private sendGtmEvent(): void {
    const eventData = {
      event: 'BNPL_SMC_VIEW',
      pageName: 'bnpl-smc',
      source: this.creditEnvironment.creditEnv,
    };
    this.gtmService.sendEvent(eventData, { platforms: ['gtm'] });
  }

  private initializeRouteParams(): void {
    const { fundProviderCode, creditId } = this.activatedRoute.snapshot.params;
    this.fundProviderCode.set(+fundProviderCode);
    this.creditId.set(creditId);
  }

  getStatus(): void {
    this.showLoading.set(true);

    this.creditScoringSmcApiService.getStatusSmc(this.creditId()).subscribe({
      next: (response) => {
        this.handleStatusResponse(response.status);
        this.showLoading.set(false);
      },
      error: (error) => this.handleStatusError(error),
    });
  }

  private handleStatusError(error: any): void {
    this.showLoading.set(false);
    this.messageService.showErrorOfErrorResponse(error);
    this.goToSteps();
  }

  private handleStatusResponse(status: StatusType): void {
    this.status.set(status);

    // Add query parameters based on status
    if (status === CREDIT_SCORING_SMC_STATUS.COMPLETED) {
      this.router.navigate([], {
        queryParams: { result: 'success' },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    } else if (status === CREDIT_SCORING_SMC_STATUS.FAILED || status === CREDIT_SCORING_SMC_STATUS.REJECTED) {
      this.router.navigate([], {
        queryParams: { result: 'failed' },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }

    if (status === CREDIT_SCORING_SMC_STATUS.INITIATED) {
      this.initSmc();
    } else if (status === CREDIT_SCORING_SMC_STATUS.IN_PROGRESS) {
      this.startInProgress();
    } else if (status === CREDIT_SCORING_SMC_STATUS.REJECTED) {
      this.sendEvent(false);
    }
    // For COMPLETED status, sendEvent will be called from onCreditAmountLoaded
  }

  private startInProgress(): void {
    this.clearInProgress();
    this.InProgressTimeout = setTimeout(() => this.getStatus(), 30000);
  }

  private clearInProgress(): void {
    if (this.InProgressTimeout) {
      clearTimeout(this.InProgressTimeout);
    }
  }

  private initSmc(): void {
    this.showLoading.set(true);

    this.creditScoringSmcApiService.initSmc(this.creditId()!).subscribe({
      next: () => {
        this.getStatus();
        this.showLoading.set(false);
      },
      error: (error: any) => this.handleInitError(error),
    });
  }

  private handleInitError(error: any): void {
    const errorStatus = error?.result?.status;

    if (errorStatus === this.ERROR_CODES.BLACKLIST) {
      this.handleBlacklistError();
    } else if (this.ERROR_CODES.SERVICE_UNAVAILABLE.includes(errorStatus)) {
      this.handleServiceUnavailableError();
    } else {
      this.handleGenericError(error);
    }
  }

  private handleGenericError(error: any): void {
    this.showLoading.set(false);
    this.messageService.showErrorOfErrorResponse(error);
    this.close();
  }

  private handleBlacklistError(): void {
    this.isBlackList.set(true);
    this.showLoading.set(false);
  }

  private handleServiceUnavailableError(): void {
    this.messageService
      .showBlockedError({
        title: 'سرویس امکان‌سنجی در دسترس نیست',
        message: 'در حال حاضر سرویس امکان‌سنجی در دسترس نیست. لطفا برای ادامه فرایند دقایقی دیگر دوباره تلاش کنید.',
        staticImage: 'no-service',
        primaryCta: 'تلاش مجدد',
        secondaryCta: 'بستن',
      })
      .then((result) => {
        result.primary ? this.getStatus() : this.close();
      });
  }

  close(): void {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/resolve')).then();
  }

  goToWallet(): void {
    this.router
      .navigateByUrl(this.creditUrlService.getInnerServicePath(`/wallet/detail/${this.creditId()}`), {
        state: {
          customLinkForBack: '/',
        },
      })
      .then();
  }

  goToSteps(): void {
    this.router
      .navigateByUrl(this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode()}/${this.creditId()}`))
      .then();
  }

  nextStep(step: StatusType): void {
    this.status.set(step);
  }

  onCreditAmountLoaded(amount: number): void {
    this.creditAmount.set(amount);
    this.sendEvent(true);
  }

  private sendEvent(result: boolean): void {
    const userId = this.creditUserService.getUserId();

    if (result) {
      const eventData: any = {
        event: 'BNPL_SCORING_SUCCESS',
        pageName: 'bnpl-scoring-result',
        userId: userId,
        creditAmount: this.creditAmount(),
        source: this.creditEnvironment.creditEnv,
      };
      this.gtmService.sendEvent(eventData, { platforms: ['gtm'] });
    } else {
      const eventData = {
        event: 'BNPL_SCORING_FAILED',
        pageName: 'bnpl-scoring-result',
        userId: userId,
        source: this.creditEnvironment.creditEnv,
      };
      this.gtmService.sendEvent(eventData, { platforms: ['gtm'] });
    }
  }

  ngOnDestroy(): void {
    this.clearInProgress();
  }
}
