import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { OrderResponse } from '../../data-access/models/order.interface';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxIcon } from '@digipay/ngx-icon';
import { ORDER_STATE, ORDER_STATE_TRANSLATION } from '../../data-access/enums/order-state.enum';
import { MessageService } from '@client-monorepo/common/utilities';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-orders-applet-seller-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    NgxDividerComponent,
    UiFormFieldBuilderModule,
    OrderSummaryComponent,
    NgxBadgeModule,
    NgxIcon,
    PipesModule,
    NgxButtonComponent,
  ],
  templateUrl: './order-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent {
  protected readonly BorderColorsEnum = BorderColorsEnum;
  protected readonly ORDER_STATE_TRANSLATION = ORDER_STATE_TRANSLATION;
  protected readonly ORDER_STATE = ORDER_STATE;
  bottomSheetService = inject(NgxBottomSheetService);
  messageService = inject(MessageService);
  orderDetail = signal<OrderResponse>(this.bottomSheetService.data().order);
  status = computed(() => {
    const state = this.orderDetail()?.state;
    if (state === ORDER_STATE.REFUND) return 'error';
    if (state === ORDER_STATE.DELIVER) return 'success';
    if (state === ORDER_STATE.PURCHASE_IN_PROGRESS) return 'inactive';
    return 'inactive';
  });

  closeBottomSheet() {
    this.bottomSheetService.closeBottomSheet();
  }

  copyText(text: string) {
    navigator.clipboard.writeText(text).then();
    this.messageService.showSuccessMessage('کپی شد');
  }
}
