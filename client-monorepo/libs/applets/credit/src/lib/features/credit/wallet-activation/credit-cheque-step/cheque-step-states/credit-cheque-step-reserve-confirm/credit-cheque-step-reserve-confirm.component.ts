import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { InstallmentSaleReservationType } from '../../../../data-access/models/credit/activation/cheque-step/installment-sale-reservation-type';
import { MessageService } from '../../../../data-access/services/message.service';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-cheque-reserve-confirm',
  templateUrl: './credit-cheque-step-reserve-confirm.component.html',
  styleUrls: ['./credit-cheque-step-reserve-confirm.component.scss', '../../credit-installment-sale.scss'],
  imports: [NgxStatusResultModule, CreditPageLoadingComponent, CreditAppBarComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepReserveConfirmComponent implements OnInit {
  buttons: Buttons[] = [
    {
      id: 'chequeReservationConfirmButtonClick',
      mode: 'form',
      style: 'fill',
      label: 'متوجه شدم',
      fullWidth: true,
    },
  ];
  creditId = input.required<string>();
  loading = signal<boolean>(true);
  longTermDueDate = signal<number>(0);
  translateToRemainingTime = computed(() => {
    const minutesInADay = 1440; // 24 hours * 60 minutes
    const minutesInAnHour = 60;

    const days = Math.floor(this.longTermDueDate() / minutesInADay);
    const remainingMinutes = this.longTermDueDate() % minutesInADay;
    const hours = Math.floor(remainingMinutes / minutesInAnHour);

    const parts = [];

    if (days > 0) {
      parts.push(`${days} روز`);
    }
    if (hours > 0) {
      parts.push(`${hours} ساعت`);
    }
    return parts.length > 0 ? parts.join(' و ') : 'کمتر از یک ساعت';
  });
  title = computed(() => `رزور سبد خرید در دیجی‌کالا به مدت  ${this.translateToRemainingTime}`);
  description = computed(
    () =>
      'سبد خرید شما در دیجی‌کالا به مدت ' +
      this.translateToRemainingTime() +
      ' تا فعال‌سازی وام رزرو شده است. برای جلوگیری از ناموجود شدن کالا(ها) و لغو سفارش، لطفا هرچه سریع‌تر فرایند دریافت وام خود را تکمیل کنید.',
  );
  close = output<void>();
  nextStep = output<void>();

  apiService = inject(CreditApiService);
  messageService = inject(MessageService);

  ngOnInit() {
    this.getReservationTime();
  }

  getReservationTime() {
    if (!sessionStorage.getItem('_reservationOrderId')) {
      this.nextStep.emit();
      return;
    }
    this.apiService.getCartReservation(this.creditId(), InstallmentSaleReservationType.INSTALLMENT).subscribe({
      next: (response) => {
        if (response.longTermDueDate) {
          this.longTermDueDate.set(response.longTermDueDate);
          this.loading.set(false);
          return;
        }
        this.nextStep.emit();
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.close.emit();
      },
    });
  }
}
