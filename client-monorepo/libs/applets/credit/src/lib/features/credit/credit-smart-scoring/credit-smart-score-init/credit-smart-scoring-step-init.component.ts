import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import { NgStyle } from '@angular/common';
import player from 'lottie-web/build/player/lottie_light';
import { SmartScoringScoreAnimation } from '../../data-access/models/credit-smart-scoring/credit-smart-scoring-score-animation';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { CreditSmartScoringStepService } from '../services/credit-smart-scoring-step.service';
import { MessageService } from '../../data-access/services/message.service';

@Component({
  selector: 'app-credit-smart-scoring-step-init',
  templateUrl: './credit-smart-scoring-step-init.component.html',
  standalone: true,
  styleUrls: ['./credit-smart-scoring-step-init.component.scss'],
  imports: [LottieComponent, NgStyle, CreditAppBarComponent, NgxButtonComponent, NgxTrackableIdDirective, NgxCalloutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class CreditSmartScoringStepInitComponent {
  animation = SmartScoringScoreAnimation;
  loading = signal(false);
  close = output<void>();
  next = output<void>();
  reloadStatus = output<void>();
  creditSmartScoringStepService = inject(CreditSmartScoringStepService);
  messageService = inject(MessageService);

  initScoring() {
    this.loading.set(true);
    this.creditSmartScoringStepService.initSmartScoring().subscribe({
      next: (response) => {
        this.sendEvent();
        if (response.needOtp) {
          this.creditSmartScoringStepService.otpConfig.set({
            needOtp: response.needOtp,
            otpLength: response.otpLength,
            otpCountDown: response.otpCountDown,
            resendAvailable: response.resendAvailable,
          });
          this.next.emit();
          return;
        }
        this.reloadStatus.emit();
      },
      error: (error) => {
        this.loading.set(false);
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  sendEvent() {
    this.creditSmartScoringStepService.sendEvent('credit_smart_scoring_init').then();
  }
}
