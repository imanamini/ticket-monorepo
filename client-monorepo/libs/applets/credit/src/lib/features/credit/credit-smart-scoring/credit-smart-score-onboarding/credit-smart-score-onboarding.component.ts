import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditSmartScoreOnboardingSheetComponent } from './credit-smart-score-onboarding-sheet/credit-smart-score-onboarding-sheet.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { CreditSmartScoreBankCreditLimitComponent } from './credit-smart-score-bank-credit-limit/credit-smart-score-bank-credit-limit.component';
import { CreditSmartScoringStepService } from '../services/credit-smart-scoring-step.service';
import { MessageService } from '../../data-access/services/message.service';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';

@Component({
  selector: 'app-credit-smart-score-onboarding',
  templateUrl: './credit-smart-score-onboarding.component.html',
  standalone: true,
  styleUrls: ['./credit-smart-score-onboarding.component.scss'],
  imports: [CreditAppBarComponent, CreditSmartScoreBankCreditLimitComponent, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSmartScoreOnboardingComponent implements OnInit {
  showOnboardingBottomSheet = input<boolean>();

  showLoading = signal(true);
  amount = signal<number | null>(null);
  installmentCount = signal<number | null>(null);

  next = output<void>();
  close = output<void>();
  noAvailablePlan = output<void>();

  private bottomSheetService = inject(NgxBottomSheetService);
  private creditSmartScoringStepService = inject(CreditSmartScoringStepService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.getLastOfPlan();
  }

  getLastOfPlan() {
    this.creditSmartScoringStepService.getCreditMaxAvailableBalance().subscribe({
      next: (response) => {
        if (response && response.balance && response.installmentCount) {
          this.amount.set(response.balance);
          this.installmentCount.set(response.installmentCount);
          if (this.showOnboardingBottomSheet()) {
            this.openOnboardingSheet();
          }
        } else {
          this.noAvailablePlan.emit();
        }
        this.showLoading.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.showLoading.set(false);
      },
    });
  }

  openOnboardingSheet(): void {
    this.bottomSheetService.openBottomSheet(CreditSmartScoreOnboardingSheetComponent, {});
    const sheetSub = this.bottomSheetService.onClose.subscribe(() => {
      sheetSub.unsubscribe();
    });
  }

  onBack(): void {
    this.close.emit();
  }
}
