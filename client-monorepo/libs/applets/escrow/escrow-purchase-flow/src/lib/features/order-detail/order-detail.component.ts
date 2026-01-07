import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HorizontalScrollComponent, PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { Router } from '@angular/router';
import { OrderService } from '../../data-access/services/order.service';
import { currencyFormat } from '@digipay/strings';
import { OrderResponse } from '../../data-access/models/order.interface';

@Component({
  selector: 'escrow-purchase-flow-applet-order-detail',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, NgOptimizedImage, HorizontalScrollComponent],
  templateUrl: './order-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent implements OnInit {
  route = inject(Router);
  orderService = inject(OrderService);
  orderDetail = signal<OrderResponse | null>(null);
  orderDetailEntries = signal<{ key: string; value: string }[]>([]);

  ngOnInit() {
    this.getOrderDetail();
  }

  handelHeaderAction() {
    this.route.navigate(['/purchase-flow']).then();
  }

  getOrderDetail() {
    this.orderService.getOrderDetail().subscribe({
      next: (order: OrderResponse) => {
        order.price = currencyFormat(order.price);
        this.orderDetail.set(order);
        const orderedEntries = [
          { key: 'مبلغ آگهی', value: order.price + ' ' + 'ریال' },
          { key: 'فروشگاه', value: order.merchantName },
          { key: 'توضیحات', value: order.data.description },
        ];
        this.orderDetailEntries.set(orderedEntries);
      },
    });
  }
}
