import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-scoring-dp-failed',
  templateUrl: './credit-scoring-dp-failed.component.html',
  styleUrls: ['./credit-scoring-dp-failed.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringDpFailedComponent {
  buttons: Buttons[] = [
    {
      id: 'primary',
      style: 'fill',
      mode: 'form',
      fullWidth: true,
      label: 'متوجه شدم',
    },
  ];
  title = 'نیاز به رتبه اعتباری بالاتر';
  description = 'با توجه به نتیجه‌ی اعتبار‌سنجی، دریافت این طرح اعتباری نیازمند رتبه‌ی بالاتری است.';

  close = output<void>();
}
