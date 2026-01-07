import { Injectable, inject, signal } from '@angular/core';
import { OrderResponse } from '../models/order.interface';
import { OrderService } from './order.service';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';

@Injectable({
  providedIn: 'root',
})
export class OrderMediatorService {
  private orderService = inject(OrderService);
  private storageService = inject(EscrowStorageService);
  private orderSignal = signal<OrderResponse | null>(null);

  constructor() {
    this.loadOrder();
  }

  get order() {
    return this.orderSignal.asReadonly();
  }

  private loadOrder() {
    this.orderService.getOrder().subscribe({
      next: (order: OrderResponse) => {
        if (typeof order === 'object' && order !== null) {
          this.orderSignal.set(order as OrderResponse);
          this.storageService.setEscrowTrackingCode(order.trackingCode);
        }
      },
      error: () => this.orderSignal.set(null),
    });
  }
}
