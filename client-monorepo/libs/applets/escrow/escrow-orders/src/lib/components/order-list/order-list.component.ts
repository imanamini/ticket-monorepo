import { ChangeDetectionStrategy, Component, computed, CreateEffectOptions, effect, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerOrderService } from '../../data-access/services/seller-order.service';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { ORDER_STATE_TRANSLATION } from '../../data-access/enums/order-state.enum';
import { OrderStateService } from '../../data-access/services/order-state.service';
import { MessageService, StorageService } from '@client-monorepo/common/utilities';
import { OrderFilterRequest, OrderResponse, OrdersResponse } from '../../data-access/models/order.interface';
import { finalize, Observable, Subject, takeUntil } from 'rxjs';
import { BuyerOrderService } from '../../data-access/services/buyer-order.service';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'escrow-orders-applet-order-list',
  standalone: true,
  imports: [CommonModule, OrderSummaryComponent, PipesModule, NgxSpinnerModule],
  templateUrl: './order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnDestroy {
  protected readonly ORDER_STATE_TRANSLATION = ORDER_STATE_TRANSLATION;
  sellerOrderService = inject(SellerOrderService);
  buyerOrderService = inject(BuyerOrderService);
  bottomSheetService = inject(NgxBottomSheetService);
  orderStateService = inject(OrderStateService);
  messageService = inject(MessageService);
  storageService = inject(StorageService);
  currentPage = 0;
  pageSize = 15;
  haveNextPage = true;
  destroy$ = new Subject<void>();
  isLoading = signal<boolean>(true);
  orders = signal<OrderResponse[]>([]);
  currentOrderState = computed(() => this.orderStateService.currentOrderState());
  role = computed(() => this.orderStateService.currentRole());

  constructor() {
    effect(
      () => {
        if (this.role() === 'seller') {
          this.fetchOrders(this.sellerOrderService.getSellerOrders.bind(this.sellerOrderService), {} as OrderFilterRequest);
        } else {
          this.fetchOrders(this.buyerOrderService.getBuyerOrders.bind(this.buyerOrderService), {} as OrderFilterRequest);
        }
      },
      { allowSignalWrites: true } as CreateEffectOptions,
    );
  }

  private fetchOrders(service: (payload: OrderFilterRequest) => Observable<OrdersResponse>, payload: OrderFilterRequest): void {
    this.isLoading.set(true);
    this.orders.set([]);
    const { page = this.currentPage, size = this.pageSize, ...restrictions } = payload;
    const requestPayload = {
      ...restrictions,
      size,
      page,
      restrictions: [
        {
          field: 'state',
          type: 'collection',
          values: this.currentOrderState(),
        },
      ],
      orders: [{ field: 'creationDate', order: 'desc' }],
    };

    service(requestPayload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (res: OrdersResponse) => {
          this.handleOrderResponse(res);
        },
        error: (error) => {
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }

  private handleOrderResponse(res: OrdersResponse) {
    if (res.orders.length < this.pageSize) {
      this.haveNextPage = false;
    }
    this.orders.set(this.orders().concat(res.orders));
  }

  openOrderDetailBottomSheet(order: OrderResponse) {
    this.bottomSheetService.openBottomSheet(OrderDetailComponent, { order });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
