import { ChangeDetectionStrategy, Component, CreateEffectOptions, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabConfig, TabGroupComponent } from '@client-monorepo/common/ui-components';
import { OrderStateService } from '../../data-access/services/order-state.service';
import { OrderListComponent } from '../../components/order-list/order-list.component';
import { ORDER_STATE } from '../../data-access/enums/order-state.enum';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { SwitchRoleComponent } from '@client-monorepo/shared/escrow/merchant-existence';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';

@Component({
  selector: 'escrow-orders-applet-orders',
  standalone: true,
  imports: [CommonModule, TabGroupComponent, SwitchRoleComponent],
  templateUrl: './orders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  orderStateService = inject(OrderStateService);
  bottomSheetService = inject(NgxBottomSheetService);
  storageService = inject(EscrowStorageService);
  tabs = signal<TabConfig[]>([]);
  isSeller = signal<boolean>(this.storageService.getEscrowLastUserRole() === 'seller');
  constructor() {
    this.initializeTabConfig();
    effect(
      () => {
        const activeTab = this.tabs().find((tab) => tab.isActive());
        if (activeTab) {
          switch (activeTab.id) {
            case 0:
              this.orderStateService.setOrderState([ORDER_STATE.DELIVER_IN_PROGRESS]);
              break;
            case 1:
              this.orderStateService.setOrderState([ORDER_STATE.DELIVER]);
              break;
            case 2:
              this.orderStateService.setOrderState([ORDER_STATE.REFUND]);
              break;
          }
        }
      },
      { allowSignalWrites: true } as CreateEffectOptions,
    );
  }

  initializeTabConfig(): void {
    this.tabs.set([
      {
        id: 0,
        label: signal(this.isSeller() ? 'ارسال شده' : 'جاری'),
        isActive: signal(true),
        component: signal(OrderListComponent),
      },
      {
        id: 1,
        label: signal('تکمیل شده'),
        isActive: signal(false),
        component: signal(OrderListComponent),
      },
      {
        id: 2,
        label: signal('لغو شده'),
        isActive: signal(false),
        component: signal(OrderListComponent),
      },
    ]);
  }

  handleRoleChange(role: string) {
    this.isSeller.set(role === 'seller');
    this.orderStateService.setCurrentRole(role);
  }
}
