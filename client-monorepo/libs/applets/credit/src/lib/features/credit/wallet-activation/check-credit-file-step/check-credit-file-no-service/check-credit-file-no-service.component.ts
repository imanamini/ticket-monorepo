import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';

@Component({
  selector: 'app-check-credit-file-no-service',
  templateUrl: './check-credit-file-no-service.component.html',
  styleUrls: ['./check-credit-file-no-service.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckCreditFileNoServiceComponent {
  buttons: Buttons[] = [
    {
      id: 'primary',
      style: 'fill',
      label: 'تلاش مجدد',
      fullWidth: true,
      mode: 'form',
    },
  ];
  title = 'بررسی پرونده اعتباری شما انجام نشد.';
  description =
    'بررسی پرونده شما به زمان بیشتری نیاز دارد. پس از دریافت نتیجه برای ادامه فرایند ثبت‌نام شما را از طریق پیامک مطلع می‌کنیم.';

  reloadStatus = output();
  back = output();

  retry() {
    this.reloadStatus.emit();
  }
}
