import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';

@Component({
  selector: 'app-credit-smart-scoring-no-available-plan',
  templateUrl: './credit-smart-scoring-no-available-plan.component.html',
  styleUrls: ['./credit-smart-scoring-no-available-plan.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent, CreditPageLoadingComponent, CreditAppBarComponent, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSmartScoringNoAvailablePlanComponent {
  buttons: Buttons[] = [
    {
      id: 'primary',
      style: 'fill',
      mode: 'section',
      fullWidth: false,
      label: 'متوجه شدم',
    },
  ];
  title = 'در حال حاضر طرحی برای نمایش وجود ندارد';
  description = 'به‌زودی طرح‌های جدید در دسترس قرار خواهد گرفت.';

  loading = signal(false);

  close = output<void>();
}
