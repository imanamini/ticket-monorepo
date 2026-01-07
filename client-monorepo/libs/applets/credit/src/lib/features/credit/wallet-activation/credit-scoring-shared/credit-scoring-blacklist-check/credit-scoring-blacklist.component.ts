import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-scoring-blacklist',
  templateUrl: './credit-scoring-blacklist.component.html',
  styleUrls: ['./credit-scoring-blacklist.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringBlacklistComponent {
  buttons: Buttons[] = [
    {
      id: 'primary',
      style: 'fill',
      mode: 'form',
      label: 'متوجه شدم',
    },
  ];
  description =
    'به علت وجود بدهی، انجام مرحله امکان‌سنجی برای شما وجود ندارد. ۲۴ ساعت بعد از پرداخت بدهی می‌توانید امکان‌سنجی خود را انجام دهید.';
  title = 'شما دارای اقساط معوق در دیجی‌پی هستید';

  close = output<void>();

  router = inject(Router);
  creditUrlService = inject(CreditUrlService);
}
