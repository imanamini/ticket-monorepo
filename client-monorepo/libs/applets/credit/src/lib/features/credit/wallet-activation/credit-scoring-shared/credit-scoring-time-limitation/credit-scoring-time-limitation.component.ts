import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditIcsSettingResponse } from '../../../data-access/models/credit/score/credit-score-setting-response';

@Component({
  selector: 'app-credit-scoring-time-limitation',
  templateUrl: './credit-scoring-time-limitation.component.html',
  standalone: true,
  styleUrls: ['./credit-scoring-time-limitation.component.scss'],
  imports: [NgxStatusResultModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringTimeLimitationComponent {
  timeLimitedData = input<CreditIcsSettingResponse>();
  buttons: Buttons[] = [
    {
      id: 'primary',
      fullWidth: true,
      style: 'fill',
      label: 'متوجه شدم',
      mode: 'form',
    },
  ];
  isConditional = computed(() => !!this.timeLimitedData()?.fromTime && !!this.timeLimitedData()?.toTime);
  title = computed(() => {
    if (this.isConditional()) {
      return `محدودیت در دسترسی به سامانه اعتبارسنجی`;
    } else {
      return 'سامانه اعتبارسنجی موقتا در دسترس نیست';
    }
  });
  description = computed(() => {
    if (this.isConditional()) {
      return `بنا به دستور بانک مرکزی، ارائه خدمات سامانه اعتبارسنجی تنها به‌صورت روزانه و در بازه زمانی ساعت ${this.timeLimitedData()?.fromTime} الی ${this.timeLimitedData()?.toTime} امکان‌پذیر خواهد بود.`;
    } else {
      return 'به محض در دسترس قرارگرفتن سامانه اعتبارسنجی به شما اطلاع خواهیم داد.';
    }
  });

  clicked = output<void>();
}
