import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderOverviewComponent } from '../order-overview/order-overview.component';
import { OrderMediatorService } from '../../data-access/services/order-mediator.service';
import { currencyFormat } from '@digipay/strings';
import { OrderService } from '../../data-access/services/order.service';
import { OrderResponse } from '../../data-access/models/order.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';

@Component({
  selector: 'escrow-purchase-flow-applet-confirm-to-pay',
  standalone: true,
  imports: [CommonModule, OrderOverviewComponent, NgxButtonComponent],
  templateUrl: './confirm-to-pay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmToPayComponent {
  orderMediatorService = inject(OrderMediatorService);
  bottomSheetService = inject(NgxBottomSheetService);
  orderService = inject(OrderService);
  storageService = inject(EscrowStorageService);
  amount = this.bottomSheetService.data().amount;
  paymentInfo: { name: string; value: string }[] = [
    { name: 'کارمزد پرداخت امن', value: 'رایگان' },
    { name: 'مقصد واریز', value: 'حساب امن دیجی‌پی' },
    { name: 'شماره همراه', value: this.storageService.getEscrowCellNumber() },
  ];

  get orderPrice() {
    return currencyFormat(this.order?.price) + ' ریال';
  }

  get agreedAmount() {
    return currencyFormat(this.amount) + ' ریال';
  }

  get order(): OrderResponse | null {
    return this.orderMediatorService.order();
  }

  confirmAndPay() {
    const payObservable = this.getPaymentObservable();

    payObservable.subscribe({
      next: (res) => this.handlePaymentSuccess(res),
      error: (error) => this.handlePaymentError(error),
    });
  }

  private getPaymentObservable() {
    return this.storageService.getEscrowTrustedLogin()
      ? this.orderService.trustedPay(this.amount)
      : this.orderService.protectedPay(this.amount);
  }

  private handlePaymentError(error: any) {
    if (error.status === 422) {
      const redirectUrl = error.error?.redirectUrl;

      this.bottomSheetService.outputData.set(true);
      this.bottomSheetService.closeBottomSheet();

      if (redirectUrl && redirectUrl.length > 0) {
        setTimeout(() => {
          window.location.replace(redirectUrl);
        }, 3000);
      }
    }
  }

  private handlePaymentSuccess(res: any) {
    if (res && res.result.status === 0) {
      window.location.replace(res.redirectUrl);
    }
  }
}
