import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditScoringApiService } from '../../../data-access/services/credit-scoring-api.service';
import { CreditScoringStepReportWrapperComponent } from '../credit-scoring-step-report-wrapper/credit-scoring-step-report-wrapper.component';
import { PlanGroup } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { ScoringStatusType } from '../credit-scoring-result-page/credit-scoring-step-result-data';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditScoringResultPageComponent } from '../credit-scoring-result-page/credit-scoring-result-page.component';
import { MessageService } from '../../../data-access/services/message.service';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxWaitingStepperComponent, WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';
import { CreditScoringStepService } from '../services/credit-scoring-step.service';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

@Component({
  selector: 'app-credit-scoring-step-result-wrapper',
  templateUrl: './credit-scoring-step-result-wrapper.component.html',
  standalone: true,
  styleUrls: ['./credit-scoring-step-result-wrapper.component.scss'],
  imports: [
    NgxStatusResultModule,
    CreditScoringResultPageComponent,
    NgxWaitingStepperComponent,
    CreditScoringStepReportWrapperComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringStepResultWrapperComponent implements OnInit {
  reportUnreadyDataMap = {
    COUNTDOWN: {
      title: 'در حال امکان‌سنجی',
      message: 'بررسی وضعیت اقساط بانکی‌شما',
      image: WaitingStepperStateEnum.PROGRESS,
    },
    EXIT: {
      title: 'در حال دریافت گزارش',
      message: 'تا دریافت کامل گزارش لطفا منتظر باشید.',
      image: WaitingStepperStateEnum.FAILED,
    },
  };
  reportUnreadyCountdown = 120;
  retryGettingReport = 1;

  timer: TimerCountDownModel = {
    timeInSeconds: this.reportUnreadyCountdown,
    timerType: 'with-badge',
  };
  warning = 'لطفا تا پایان شمارش از این صفحه خارج نشوید';

  fundProviderCode = signal<number | null>(null);
  creditId = signal<string | null>(null);
  status = signal<ScoringStatusType | null>(null);
  gettingData = signal<boolean | null>(null);
  trackingCode = signal<string | null>(null);
  reportUnreadyType = signal<'COUNTDOWN' | 'EXIT' | null>(null);
  suggestedPlans = signal<PlanGroup[]>([]);
  showReportPage = signal(false);

  title = computed(() => (this.reportUnreadyType() === 'EXIT' ? 'نتیجه اعتبارسنجی' : 'امکان‌سنجی دریافت وام'));
  buttons = computed<Buttons[]>(() => {
    if (this.reportUnreadyType() === 'EXIT') {
      return [
        {
          id: 'creditScoringReportStartedWaitingButton',
          mode: 'section',
          label: 'متوجه شدم',
          style: 'fill',
        },
      ];
    }
    return [];
  });
  waitingStepperState = computed(() =>
    this.reportUnreadyType() === 'COUNTDOWN' ? WaitingStepperStateEnum.PROGRESS : WaitingStepperStateEnum.SUCCESS,
  );

  creditScoringStepService = inject(CreditScoringStepService);
  creditScoringApiService = inject(CreditScoringApiService);
  creditUrlService = inject(CreditUrlService);
  message = inject(MessageService);
  bottomSheetService = inject(NgxBottomSheetService);
  gtmService = inject(NgxEventTrackerService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.fundProviderCode.set(+this.creditScoringStepService.getFundProviderCode());
    this.creditId.set(this.creditScoringStepService.getCreditId());
    this.trackingCode.set(this.creditScoringStepService.getTrackingCode());
    if (this.creditScoringStepService.getErrorTypeValue() === 'SHAHKAR_FAILED') {
      this.status.set('SHAHKAR_FAILED');
    } else if (this.creditScoringStepService.getErrorTypeValue() === 'FAILED') {
      this.status.set('FAILED');
    } else {
      this.getData();
    }
  }

  getData(): void {
    if (this.creditScoringStepService.getWaitingResult()) {
      this.reportUnreadyType.set('EXIT');
      return;
    }
    this.gettingData.set(true);
    this.reportUnreadyType.set(null);
    this.creditScoringApiService.inquiryWithoutPay(this.creditId()!).subscribe({
      next: (response) => {
        this.addQueryParams(response.isAcceptable);
        this.sendEvent(response.isAcceptable);
        this.status.set(response.isAcceptable ? 'SUCCESS' : 'FAILED');
        if (!response.isAcceptable) {
          this.getSuggestedPlans();
          return;
        }
        this.gettingData.set(false);
      },
      error: (error) => {
        // handle an async report: CREDIT_SCORE_ICS_SCORE_UNREADY(16514)
        if (error && error.result && error.result.status === 16514) {
          this.reportUnreadyType.set(this.retryGettingReport <= 0 ? 'EXIT' : 'COUNTDOWN');
          if (!this.retryGettingReport) {
            this.retryGettingReport = 1;
          } else {
            this.retryGettingReport--;
          }
          this.gettingData.set(false);
          return;
        } else {
          if (this.message.isNoServiceError(error)) {
            this.message
              .showBlockedError({
                title: 'اشکال در اتصال به سرویس‌دهنده',
                message: 'در حال‌حاضر سرویس‌دهنده در دسترس نیست. لطفاً برای ادامه فرآیند دقایقی دیگر دوباره تلاش کنید.',
                staticImage: 'no-service',
                primaryCta: 'بستن',
                secondaryCta: '',
              })
              .then((result) => {
                if (result.primary) {
                  this.closeStep();
                }
              });
            return;
          }
          this.message.showErrorOfErrorResponse(error);
          this.closeStep();
          this.gettingData.set(false);
        }
      },
    });
  }

  getSuggestedPlans() {
    this.creditScoringApiService.getSuggestedPlans(this.creditId()!).subscribe({
      next: (response) => {
        if (response.planGroupDetails && response.planGroupDetails.length) {
          this.suggestedPlans.set(response.planGroupDetails);
        }
        this.gettingData.set(false);
      },
      error: () => {
        this.gettingData.set(false);
      },
    });
  }

  exit(): void {
    this.creditScoringStepService.closeFlow();
  }

  showReport() {
    this.showReportPage.set(true);
  }

  closeStep(): void {
    this.creditScoringStepService.goToCreditHome('overview');
  }

  private sendEvent(result: boolean): void {
    const eventData = {
      event: 'CREDIT_SCORING_' + (result ? 'SUCCESS' : 'FAILED'),
      pageName: 'credit-scoring-result',
    };
    this.gtmService.sendEvent(eventData, { platforms: ['gtm'] });
  }

  addQueryParams(result: boolean) {
    const newQueryParams = { scoring: result };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newQueryParams,
      queryParamsHandling: 'merge',
    });
  }

  protected readonly WaitingStepperStateEnum = WaitingStepperStateEnum;
}
