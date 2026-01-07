import { Component, inject, OnInit, signal } from '@angular/core';
import { PaymentCardComponent } from '../../components/payment-card/payment-card.component';
import { PurchaseService } from '../../services/purchase-service.service';

import {
  INVESTMENT_LIST_ROUTE,
  RESULT_ROUTE,
  SELL_OTP_ROUTE,
  SELL_ROUTE,
  SELL_STOCK_ROUTE,
} from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { PaymentCard } from '../../../../data-access/models/payment-card.model';
import { OrderStatus } from '../../../../data-access/enums/order-status';

@Component({
  selector: 'app-sell-detail',
  templateUrl: './sell-detail.component.html',
  styleUrls: ['./sell-detail.component.scss'],
  standalone: true,
  imports: [PaymentCardComponent, NgxButtonComponent, NgxAppBarComponent],
})
export class SellDetailComponent implements OnInit {
  state = signal<PaymentCard | undefined>(undefined);
  isLoading = signal<boolean>(false);

  private routeState = inject(RouteStateService);
  private purchaseService = inject(PurchaseService);
  navigationService = inject(WealthNavigationService);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    if (!this.state()?.symbol) {
      this.navigationService.navigate([INVESTMENT_LIST_ROUTE], {
        queryParams: {
          type: 'FixedIncome',
        },
      });
    }
  }

  onBackHandler() {
    if (this.state()?.type === 'IPO') {
      this.navigationService.navigate([SELL_STOCK_ROUTE, this.state()?.symbol], {
        state: this.state,
      });
    } else {
      this.navigationService.navigate([SELL_ROUTE, this.state()?.symbol], {
        state: { unitCount: this.state().unit },
      });
    }
  }

  onSell() {
    this.isLoading.set(true);
    this.purchaseService
      .sellOrder({
        symbol: this.state().symbol,
        instrumentUnit: this.state().unit,
      })
      .subscribe((res) => {
        if (res?.success) {
          if (res.result.requiresOtp) {
            this.navigationService.navigate([SELL_OTP_ROUTE], {
              state: this.state(),
            });
          } else {
            this.navigationService.navigate([RESULT_ROUTE], {
              queryParams: {
                isSuccess:
                  res.result.orderStatus === OrderStatus.Approved || res.result.orderStatus === OrderStatus.Success ? 'true' : 'false',
                action: 'sell',
                receiptNumber: res.result.remoteOrderId,
                instrumentName: res.result.instrumentName,
                instrumentSymbol: res && res.result && res.result.instrumentSymbol,
                type: res.result.investmentType,
              },
            });
          }
        }
        this.isLoading.set(false);
      });
  }
}
