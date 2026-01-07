import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { MessageService } from '@client-monorepo/common/utilities';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { OrderDetailComponent } from '../../order-detail/order-detail.component';
import { BuyerOrderService } from '../../../data-access/services/buyer-order.service';
import { ORDER_STATE, ORDER_STATE_TRANSLATION } from '../../../data-access/enums/order-state.enum';
import { OrderSummaryComponent } from '../../order-summary/order-summary.component';
import { BuyerRatingComponent } from '../buyer-rating/buyer-rating.component';
import { MappedOrderResponse, OrderFilterRequest, OrderResponse, OrdersResponse } from '../../../data-access/models/order.interface';
import { ORDER_STATE_LINE_COLOR } from '../../../data-access/constants/order-state-color.const';
import { EMOJIS } from '../../../data-access/constants/emoji.const';
import { ORDER_STATE_DESCRIPTIONS } from '../../../data-access/constants/order-state-description.const';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-home-applet-buyer-home',
  standalone: true,
  imports: [CommonModule, NgxDividerComponent, OrderSummaryComponent, PipesModule, NgxSpinnerModule, NgxButtonComponent],
  templateUrl: './buyer-home.component.html',
  styles: `
    .line {
      flex: 1;
      height: 6px;
      border-radius: 50px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuyerHomeComponent implements OnInit, OnDestroy {
  protected readonly ORDER_STATE_Translation = ORDER_STATE_TRANSLATION;
  protected readonly ORDER_STATE = ORDER_STATE;
  protected readonly EMOJIS = EMOJIS;
  protected readonly BorderColorsEnum = BorderColorsEnum;
  destroy$ = new Subject<void>();
  buyerOrderService = inject(BuyerOrderService);
  bottomSheetService = inject(NgxBottomSheetService);
  messageService = inject(MessageService);
  route = inject(Router);
  currentPage = 0;
  pageSize = 15;
  haveNextPage = true;
  isLoading = signal<boolean>(true);
  orders = signal<MappedOrderResponse[]>([]);

  ngOnInit() {
    this.getBuyerOrders({} as OrderFilterRequest);
  }

  private getBuyerOrders(payload: OrderFilterRequest) {
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
          values: [ORDER_STATE.VERIFIED, ORDER_STATE.CONFIRM, ORDER_STATE.DELIVER_IN_PROGRESS, ORDER_STATE.CONFLICT, ORDER_STATE.REFUND],
        },
      ],
      orders: [{ field: 'creationDate', order: 'desc' }],
    };

    this.buyerOrderService
      .getBuyerOrders(requestPayload)
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
    const mappedOrders = this.mapOrders(res.orders);
    this.createOrderList(mappedOrders);
  }

  private mapOrders(orders: OrderResponse[]): MappedOrderResponse[] {
    return orders.map((order: OrderResponse) => {
      const mappedOrder = {
        ...order,
        stateDescription: this.getStateDescription(order.state),
        lineColors: this.computeLineColors(order.state),
      };

      return mappedOrder;
    });
  }

  private getStateDescription(state: ORDER_STATE): string {
    return ORDER_STATE_DESCRIPTIONS[state] || '';
  }

  private createOrderList(orders: MappedOrderResponse[]): void {
    this.orders.set(this.orders().concat(orders));
  }

  openOrderDetailBottomSheet(order: OrderResponse) {
    this.bottomSheetService.openBottomSheet(OrderDetailComponent, { order });
  }

  private computeLineColors(state: number): string[] {
    const result: string[] = new Array(4).fill('surface-back');
    const stateColors: string[] = ORDER_STATE_LINE_COLOR[state] || [];

    stateColors.forEach((color: string, index: number) => {
      result[index] = color;
    });

    return result;
  }

  confirmDeliverOrder(trackingCode: string) {
    this.buyerOrderService
      .deliverOrder(trackingCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.messageService.showSuccessMessage('سفارش شما تکمیل شد');
        this.getBuyerOrders({} as OrderFilterRequest);
      });
  }

  openRatingBottomSheet(trackingCode: string) {
    this.bottomSheetService.openBottomSheet(BuyerRatingComponent, { trackingCode });
    this.bottomSheetService.onClose.subscribe(() => this.getBuyerOrders({} as OrderFilterRequest));
  }

  conflictOrder(trackingCode: string) {
    this.route.navigate(['conflict/conflict-list', trackingCode]).then();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
