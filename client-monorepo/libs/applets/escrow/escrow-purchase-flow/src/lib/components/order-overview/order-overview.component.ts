import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { OrderResponse } from '../../data-access/models/order.interface';
import { Router } from '@angular/router';
import { currencyFormat } from '@digipay/strings';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-purchase-flow-applet-order-overview',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, NgxButtonComponent],
  templateUrl: './order-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderOverviewComponent {
  private router = inject(Router);
  order = input<OrderResponse>();
  orderPrice = computed(() => currencyFormat(this.order()?.price));
  showPrice = input<boolean>(true);
  showDetailButton = input<boolean>(true);

  goToOrderDetail() {
    this.router.navigate(['purchase-flow/order-detail']).then();
  }
}
