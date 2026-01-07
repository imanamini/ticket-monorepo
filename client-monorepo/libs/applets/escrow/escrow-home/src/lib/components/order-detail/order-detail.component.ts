import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxIcon } from '@digipay/ngx-icon';
import { MessageService } from '@client-monorepo/common/utilities';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { ORDER_STATE, ORDER_STATE_TRANSLATION } from '../../data-access/enums/order-state.enum';
import { OrderResponse } from '../../data-access/models/order.interface';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { DeliverTypeEnum } from '../../data-access/enums/deliver-type.enum';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-home-applet-order-detail',
  standalone: true,
  imports: [CommonModule, NgxBadgeModule, NgxDividerComponent, NgxIcon, OrderSummaryComponent, PipesModule, NgxButtonComponent],
  templateUrl: './order-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent {
  protected readonly BorderColorsEnum = BorderColorsEnum;
  protected readonly ORDER_STATE_TRANSLATION = ORDER_STATE_TRANSLATION;
  bottomSheetService = inject(NgxBottomSheetService);
  messageService = inject(MessageService);
  orderDetail = signal<OrderResponse>(this.bottomSheetService.data().order);
  status = computed(() => {
    const state = this.orderDetail()?.state;
    if (
      state === ORDER_STATE.REFUND_IN_PROGRESS ||
      state === ORDER_STATE.REFUND ||
      state === ORDER_STATE.REFUND_FAIlURE ||
      state === ORDER_STATE.FAIL ||
      state === ORDER_STATE.PAYMENT_FAilURE ||
      state === ORDER_STATE.CONFLICT
    )
      return 'error';
    if (state === ORDER_STATE.DELIVER || state === ORDER_STATE.DELIVER_IN_PROGRESS) return 'success';
    if (state === ORDER_STATE.CONFIRM) return 'inactive';
    return 'inactive';
  });

  closeBottomSheet() {
    this.bottomSheetService.closeBottomSheet();
  }

  copyText(text: string) {
    navigator.clipboard.writeText(text).then();
    this.messageService.showSuccessMessage('کپی شد');
  }

  protected readonly DeliverTypeEnum = DeliverTypeEnum;
}
