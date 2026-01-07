import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BnplErrorHandlingService } from '../services/bnpl-error-handling.service';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'bnpl-failed-scoring-page',
  templateUrl: './bnpl-failed-scoring-page.component.html',
  styleUrls: ['./bnpl-failed-scoring-page.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, NgxStatusResultModule, NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplFailedScoringPageComponent {
  timer = signal<TimerCountDownModel>({
    timerType: 'mm:ss',
    timeInSeconds: 10,
  });

  bnplErrorHandlingService = inject(BnplErrorHandlingService);

  backToMerchant(): void {
    this.bnplErrorHandlingService.backToMerchant();
  }
}
