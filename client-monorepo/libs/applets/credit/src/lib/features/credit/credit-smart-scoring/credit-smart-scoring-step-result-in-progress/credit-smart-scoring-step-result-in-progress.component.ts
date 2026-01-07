import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxWaitingStepperComponent, WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditUrlService } from '../../data-access/utils/url';
import { MessageService } from '../../data-access/services/message.service';
import { CreditSmartScoringStepService } from '../services/credit-smart-scoring-step.service';
import { CreditSmartScoringConfigResponse } from '../../data-access/models/credit-smart-scoring/credit-smart-scoring-config.response';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

@Component({
  selector: 'app-credit-smart-scoring-step-result-in-progress',
  templateUrl: './credit-smart-scoring-step-result-in-progress.component.html',
  standalone: true,
  styleUrls: ['./credit-smart-scoring-step-result-in-progress.component.scss'],
  imports: [NgxStatusResultModule, NgxWaitingStepperComponent, CreditAppBarComponent, CreditScrollableViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSmartScoringStepResultInProgressComponent implements OnInit {
  creditScoringConfig = input<CreditSmartScoringConfigResponse>();

  reportUnreadyDataMap: { [key: string]: { title: string; message: string; buttons: Buttons[] } } = {
    COUNTDOWN: {
      title: 'در حال امکان‌سنجی',
      message: 'بررسی سوابق مالی و بانکی',
      buttons: [],
    },
    EXIT: {
      title: 'در حال امکان‌سنجی',
      message: 'فرایند اعتبارسنجی به زمان بیشتری نیاز دارد. نتیجه را به‌ زودی از طریق پیامک دریافت می‌کنید.',
      buttons: [
        {
          id: 'smartScoringWaitingButton',
          fullWidth: false,
          style: 'fill',
          mode: 'section',
          label: 'متوجه شدم',
        },
      ],
    },
  };
  reportUnreadyCountdown = 180;

  timer: TimerCountDownModel = {
    timeInSeconds: this.reportUnreadyCountdown,
    timerType: 'with-badge',
  };
  warning = 'لطفا تا پایان شمارش از این صفحه خارج نشوید';

  reportUnreadyType = signal<'COUNTDOWN' | 'EXIT' | null>(null);
  showReportPage = signal(false);

  status = computed(() => this.creditScoringConfig()?.status);
  trackingCode = computed(() => this.creditScoringConfig()?.icsTrackingCode);
  expirationDate = computed(() => this.creditScoringConfig()?.expirationDate);

  close = output<void>();
  reload = output<void>();

  creditScoringStepService = inject(CreditSmartScoringStepService);
  creditUrlService = inject(CreditUrlService);
  message = inject(MessageService);
  bottomSheetService = inject(NgxBottomSheetService);
  gtmService = inject(NgxEventTrackerService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  protected readonly WaitingStepperStateEnum = WaitingStepperStateEnum;

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.getData();
  }

  getData(): void {
    if (this.creditScoringStepService.getWaitingResult()) {
      this.reportUnreadyType.set('EXIT');
      return;
    }
    this.reportUnreadyType.set(null);
    const retryGettingReport = this.creditScoringStepService.getRetryGettingReport();
    this.reportUnreadyType.set(retryGettingReport <= 0 ? 'EXIT' : 'COUNTDOWN');
    if (!retryGettingReport) {
      this.creditScoringStepService.setRetryGettingReport(1);
    } else {
      this.creditScoringStepService.setRetryGettingReport(retryGettingReport - 1);
    }
  }

  exit(): void {
    this.close.emit();
  }

  showReport() {
    this.showReportPage.set(true);
  }

  closeStep(): void {
    this.creditScoringStepService.goToCreditHome('overview');
  }

  addQueryParams(result: boolean) {
    const newQueryParams = { scoring: result };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newQueryParams,
      queryParamsHandling: 'merge',
    });
  }

  goToSelectPlan() {
    // TODO: navigate user to select plan
  }

  private sendEvent(result: boolean): void {
    const eventData = {
      event: 'CREDIT_SCORING_' + (result ? 'SUCCESS' : 'FAILED'),
      pageName: 'credit-scoring-result',
    };
    this.gtmService.sendEvent(eventData, { platforms: ['gtm'] });
  }
}
