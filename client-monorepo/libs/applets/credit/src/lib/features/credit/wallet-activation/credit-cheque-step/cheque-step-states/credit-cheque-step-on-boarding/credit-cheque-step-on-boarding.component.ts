import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ChequeOnBoardingResponse } from '../../../../data-access/models/credit/activation/cheque-step/cheque-on-boarding.response';
import { StepCodes } from '../../../../data-access/models/credit/activation/step-codes';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { MessageService } from '../../../../data-access/services/message.service';
import { CreditChequeStepConditionBottomSheetComponent } from '../credit-cheque-step-condition-bottom-sheet/credit-cheque-step-condition-bottom-sheet.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web/build/player/lottie_light';
import { CreditChequeOnboardingAnimation } from './credit-cheque-onboarding-animation';

@Component({
  selector: 'app-credit-cheque-step-on-boarding',
  templateUrl: './credit-cheque-step-on-boarding.component.html',
  imports: [NgxCalloutComponent, NgxStatusResultModule, CreditAppBarComponent, LottieComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class CreditChequeStepOnBoardingComponent {
  buttons: Buttons[] = [
    {
      id: 'CreditChequeStepOnboardingStartButton',
      fullWidth: true,
      mode: 'form',
      label: 'شروع',
      style: 'fill',
    },
  ];
  onboardingAnimation = CreditChequeOnboardingAnimation;

  fundProviderCode = input.required<number>();
  creditId = input.required<string>();
  stepCode = input<number>();
  isInstallment = input<boolean>();
  data = input<ChequeOnBoardingResponse>();

  nextStep = output();
  prevStep = output();

  private bottomSheetService = inject(NgxBottomSheetService);
  private apiService = inject(CreditApiService);
  private messageService = inject(MessageService);

  openChequeConditionBottomSheet() {
    this.bottomSheetService.openBottomSheet(
      CreditChequeStepConditionBottomSheetComponent,
      { isInstallment: this.isInstallment() },
      {
        noPadding: true,
        disableClose: true,
      },
    );

    const onClose = this.bottomSheetService.onClose.subscribe({
      next: () => {
        onClose.unsubscribe();
        this.onNext();
      },
    });
  }

  onNext(): void {
    if (StepCodes[this.stepCode()!] === 'INSTALLMENT_SELLS') {
      this.apiService.installmentSellsInit(this.creditId()).subscribe({
        next: () => {
          this.nextStep.emit();
        },
        error: (error) => {
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
    } else {
      this.nextStep.emit();
    }
  }
}
