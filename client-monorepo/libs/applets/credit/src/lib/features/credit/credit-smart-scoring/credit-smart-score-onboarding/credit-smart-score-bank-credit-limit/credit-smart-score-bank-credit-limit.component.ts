import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { NgxCard } from '@digipay/ngx-card';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { CreditSmartScoringStepService } from '../../services/credit-smart-scoring-step.service';

@Component({
  selector: 'app-credit-smart-score-bank-credit-limit',
  templateUrl: './credit-smart-score-bank-credit-limit.component.html',
  standalone: true,
  styleUrls: ['./credit-smart-score-bank-credit-limit.component.scss'],
  imports: [NgxCard, NgxButtonComponent, NgxBadgeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSmartScoreBankCreditLimitComponent {
  private creditSmartScoringStepService = inject(CreditSmartScoringStepService);

  onNextClick = output<void>();

  maxInstallmentCount = input<number>(12);
  maxCreditAmount = input<number>(50000000);
  isLoading = signal<boolean>(false);

  messages: string[] = ['کاملا آنلاین بدون مراجعه حضوری', 'اعطای وام در کمترین زمان', 'بدون ضامن'];

  onNext(): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.creditSmartScoringStepService.smartScoringOnboard().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.onNextClick.emit();
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
