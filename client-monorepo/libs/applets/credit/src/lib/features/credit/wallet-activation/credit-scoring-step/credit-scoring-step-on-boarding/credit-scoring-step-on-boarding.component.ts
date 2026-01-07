import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { CreditScoringWithoutPayConfigResponse } from '../../../data-access/models/credit-scoring/basic/credit-scoring-without-pay-config.response';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditScoringStepService } from '../services/credit-scoring-step.service';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScoringStepType } from '../services/credit-scoring-step.type';
import { MessageService } from '../../../data-access/services/message.service';
import { SCORING_STATUS_CODE } from '../services/credit-scoring-step-status';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditScoringOnboardingAnimation } from './credit-scoring-onboarding-animation';
import player from 'lottie-web/build/player/lottie_light';

@Component({
  selector: 'app-credit-scoring-step-on-boarding',
  templateUrl: './credit-scoring-step-on-boarding.component.html',
  standalone: true,
  styleUrls: ['./credit-scoring-step-on-boarding.component.scss'],
  imports: [NgxCalloutComponent, CreditPageLoadingComponent, CreditAppBarComponent, NgxStatusResultModule, LottieComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class CreditScoringStepOnBoardingComponent {
  buttons: Buttons[] = [
    {
      id: 'CreditScoringStepOnboardingStartButton',
      fullWidth: true,
      mode: 'form',
      label: 'شروع',
      style: 'fill',
    },
  ];
  onboardingAnimation = CreditScoringOnboardingAnimation;

  creditScoringConfig = input<CreditScoringWithoutPayConfigResponse>();

  loading = signal<boolean>(false);

  onPrev = output<void>();
  onNext = output<void>();
  goToStep = output<CreditScoringStepType>();

  creditScoringStepService = inject(CreditScoringStepService);
  bottomSheetService = inject(NgxBottomSheetService);
  messageService = inject(MessageService);

  submit(): void {
    this.loading.set(true);
    this.creditScoringStepService.initCreditScoring().subscribe({
      next: (response) => {
        if (response.acceptable) {
          this.goToStep.emit(CreditScoringStepType.WHITE_LIST);
          return;
        }
        if (response.acceptable === false) {
          this.goToStep.emit(CreditScoringStepType.DP_FAILED);
          return;
        }
        this.creditScoringStepService.setTrackingCode(response.trackingCode);
        this.creditScoringStepService.otpConfig.set({ needOtp: response.needOtp, otpLength: response.otpLength });
        this.onNext.emit();
      },
      error: (error) => {
        if (error?.result?.status === SCORING_STATUS_CODE.BLACK_LIST) {
          this.goToStep.emit(CreditScoringStepType.BLACKLIST_CHECK);
          return;
        }
        if (error?.result?.status === SCORING_STATUS_CODE.SHAHKAR_FAILED) {
          this.creditScoringStepService.setErrorType('SHAHKAR_FAILED');
          this.goToStep.emit(CreditScoringStepType.RESULT);
          return;
        }
        if (error?.result?.status === SCORING_STATUS_CODE.REPORT_UNREADY) {
          this.creditScoringStepService.setErrorType('UNREADY');
          this.goToStep.emit(CreditScoringStepType.RESULT);
          return;
        }
        if (this.messageService.isNoServiceError(error)) {
          this.showErrorMessage();
          return;
        } else if (error && error.result && error.result.message) {
          this.messageService.showErrorOfErrorResponse(error);
        } else {
          this.messageService.showErrorMessage('بروز خطا! لطفا مجددا تلاش کنید');
        }
        this.creditScoringStepService.closeFlow();
      },
    });
  }

  showErrorMessage() {
    this.messageService
      .showBlockedError({
        title: 'اشکال در اتصال به سرویس‌دهنده',
        message: 'در حال‌حاضر سرویس‌دهنده در دسترس نیست. لطفاً برای ادامه فرآیند دقایقی دیگر دوباره تلاش کنید.',
        staticImage: 'no-service',
        primaryCta: 'تلاش مجدد',
        secondaryCta: 'بازگشت به خانه',
      })
      .then((result) => {
        if (result.secondary) {
          this.creditScoringStepService.closeFlow();
        }
        if (result.primary) {
          this.submit();
        }
      });
  }
}
