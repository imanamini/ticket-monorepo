import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../../../../components/credit-app-bar/credit-app-bar.component';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { JalaliDatePipe } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'app-credit-cheque-delivery-full-capacity-error',
  templateUrl: './credit-cheque-delivery-full-capacity-error.component.html',
  styleUrls: ['./credit-cheque-delivery-full-capacity-error.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  providers: [JalaliDatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeDeliveryFullCapacityErrorComponent {
  title = 'عدم امکان رزرو';
  description = 'ظرفیت روزهای قابل رزرو برای این روش در این شهر و استان تکمیل شده یا هنوز روزی برای آن تعریف نشده است.';
  buttons: Buttons[] = [
    {
      id: 'changeDeliveryMethod',
      mode: 'form',
      style: 'fill',
      label: 'تغییر روش ارسال',
      fullWidth: true,
    },
  ];

  back = output();
  goToFirstStep = output<void>();
}
