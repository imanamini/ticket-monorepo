import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { GetSigningDocumentsOnBoardingResponse } from '../../../data-access/models/credit/activation/signing-documents-step/get-signing-documents-on-boarding.response';
import { MessageService } from '../../../data-access/services/message.service';
import { CreditSigningDocumentsErrorComponent } from '../credit-signing-documents-error/credit-signing-documents-error.component';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web/build/player/lottie_light';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { CreditSigningDocumentOnboardingAnimation } from './credit-signing-document-onboarding-animation';

@Component({
  selector: 'app-credit-signing-documents-on-boarding',
  templateUrl: './credit-signing-documents-on-boarding.component.html',
  styleUrls: ['./credit-signing-documents-on-boarding.component.scss'],
  imports: [
    CreditSigningDocumentsErrorComponent,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    NgxStatusResultModule,
    LottieComponent,
    NgxCalloutComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class CreditSigningDocumentsOnBoardingComponent implements OnInit {
  buttons: Buttons[] = [
    {
      id: 'CreditScoringStepOnboardingStartButton',
      fullWidth: true,
      mode: 'form',
      label: 'شروع',
      style: 'fill',
    },
  ];
  onboardingAnimation = CreditSigningDocumentOnboardingAnimation;

  creditId = input.required<string>();
  showLoading = signal<boolean | null>(null);
  data = signal<GetSigningDocumentsOnBoardingResponse | null>(null);
  close = output<void>();
  finish = output<void>();
  setCountDown = output<number>();
  errorType = signal<'NO_SERVICE' | 'ERROR' | null>(null);

  private creditApiService = inject(CreditApiService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.showLoading.set(true);
    this.creditApiService.getSigningDocumentsOnBoarding(this.creditId()).subscribe({
      next: (response) => {
        this.data.set(response);
        if (response && response.countDownSeconds) {
          this.setCountDown.emit(response.countDownSeconds);
        }
        this.showLoading.set(false);
      },
      error: (error) => {
        if (error && error.result && error.result.status === 1118) {
          this.errorType.set('NO_SERVICE');
          return;
        }
        this.messageService.showErrorOfErrorResponse(error);
        this.close.emit();
      },
    });
  }

  onBackClick() {
    this.close.emit();
  }

  onCtaClick() {
    this.showLoading.set(true);
    this.creditApiService.generateDocumentsForSigning(this.creditId()).subscribe({
      next: () => {
        this.finish.emit();
        this.showLoading.set(false);
      },
      error: (error) => {
        if (error && error.result && error.result.status === 1118) {
          this.errorType.set('NO_SERVICE');
          this.showLoading.set(false);
          return;
        }
        this.messageService.showErrorOfErrorResponse(error);
        this.showLoading.set(false);
      },
    });
  }
}
