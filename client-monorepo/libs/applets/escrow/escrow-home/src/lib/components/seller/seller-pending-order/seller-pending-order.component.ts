import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { PendingOrderStateService } from '../../../data-access/services/order-state.service';
import { SellerCancelOrderComponent } from '../seller-cancel-order/seller-cancel-order.component';
import { OrderDetailComponent } from '../../order-detail/order-detail.component';
import { OrderSummaryComponent } from '../../order-summary/order-summary.component';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { SellerOrderService } from '../../../data-access/services/seller-order.service';
import { OrderFilterRequest, OrderResponse, OrdersResponse } from '../../../data-access/models/order.interface';
import { ORDER_STATE, ORDER_STATE_TRANSLATION } from '../../../data-access/enums/order-state.enum';
import { finalize, Subject, takeUntil } from 'rxjs';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-home-applet-seller-pending-order',
  standalone: true,
  imports: [CommonModule, OrderSummaryComponent, NgxDividerComponent, PipesModule, NgxBadgeModule, NgxSpinnerModule, NgxButtonComponent],
  templateUrl: './seller-pending-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerPendingOrderComponent implements OnInit, OnDestroy {
  protected readonly ORDER_STATE_TRANSLATION = ORDER_STATE_TRANSLATION;
  protected readonly ORDER_STATE = ORDER_STATE;
  protected readonly BorderColorsEnum = BorderColorsEnum;
  sellerOrderService = inject(SellerOrderService);
  bottomSheetService = inject(NgxBottomSheetService);
  pendingOrderStateService = inject(PendingOrderStateService);
  messageService = inject(MessageService);
  route = inject(Router);
  currentPage = 0;
  pageSize = 15;
  haveNextPage = true;
  destroy$ = new Subject<void>();
  isLoading = signal<boolean>(true);
  pendingOrders = signal<OrderResponse[]>([]);
  currentPendingOrderState = computed(() => this.pendingOrderStateService.currentPendingOrderState());

  ngOnInit() {
    this.getSellerOrders({} as OrderFilterRequest);
  }

  getSellerOrders(payload: OrderFilterRequest) {
    this.isLoading.set(true);
    this.pendingOrders.set([]);
    const { page = this.currentPage, size = this.pageSize, ...restrictions } = payload;
    const requestPayload = {
      ...restrictions,
      size,
      page,
      restrictions: [
        {
          field: 'state',
          type: 'collection',
          values: [this.currentPendingOrderState()],
        },
      ],
      orders: [{ field: 'creationDate', order: 'desc' }],
    };

    this.sellerOrderService
      .getSellerOrders(requestPayload)
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
    this.pendingOrders.set(this.pendingOrders().concat(res.orders));
  }

  confirmOrder(trackingCode: string) {
    this.sellerOrderService
      .confirmSellerOrder(trackingCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.showSuccessMessage('سفارش تایید شد');
          this.getSellerOrders({} as OrderFilterRequest);
        },
        error: (error) => {
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
    this.bottomSheetService.closeBottomSheet();
  }

  openCancelOrderBottomSheet(trackingCode: string) {
    this.bottomSheetService.openBottomSheet(SellerCancelOrderComponent, { trackingCode });
    this.bottomSheetService.onClose.subscribe(() => {
      this.getSellerOrders({} as OrderFilterRequest);
    });
  }

  openPendingOrderDetailBottomSheet(order: OrderResponse) {
    this.bottomSheetService.openBottomSheet(OrderDetailComponent, { order });
  }

  navigateToDelivery(trackingCode: string) {
    this.route.navigate(['delivery/setting', trackingCode]).then();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
