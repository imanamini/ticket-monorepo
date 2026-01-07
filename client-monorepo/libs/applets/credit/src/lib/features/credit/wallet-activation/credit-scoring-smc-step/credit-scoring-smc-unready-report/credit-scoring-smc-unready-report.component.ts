import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-scoring-smc-unready-report',
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  templateUrl: './credit-scoring-smc-unready-report.component.html',
  styleUrl: './credit-scoring-smc-unready-report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringSmcUnreadyReportComponent {
  data = signal({
    title: 'در حال امکان‌سنجی',
    message: 'تهیه گزارش امکان‌سنجی شما نیاز به زمان بیشتری دارد، تا دقایق دیگر نتیجه‌ی گزارش را از طریق پیامک برایتان ارسال می‌کنیم.',
    image: 'scoring',
  });
  buttons: Buttons[] = [
    {
      id: 'primary',
      style: 'tinted-on-elevated',
      mode: 'form',
      label: 'متوجه شدم',
    },
  ];
  close = output<void>();
  back = output<void>();
}
