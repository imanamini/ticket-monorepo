import { ChangeDetectionStrategy, Component, CreateEffectOptions, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabConfig, TabGroupComponent } from '@client-monorepo/common/ui-components';
import { SellerPendingOrderComponent } from '../seller-pending-order/seller-pending-order.component';
import { SellerOnboardingOrderComponent } from '../seller-onboarding-order/seller-onboarding-order.component';
import { PendingOrderStateService } from '../../../data-access/services/order-state.service';
import { ORDER_STATE, ORDER_STATE_TRANSLATION } from '../../../data-access/enums/order-state.enum';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';

@Component({
  selector: 'escrow-home-applet-seller-home',
  standalone: true,
  imports: [CommonModule, TabGroupComponent],
  templateUrl: './seller-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerHomeComponent implements OnInit {
  tabs = signal<TabConfig[]>([]);
  bottomSheetService = inject(NgxBottomSheetService);
  pendingOrderStateService = inject(PendingOrderStateService);
  storageService = inject(EscrowStorageService);

  constructor() {
    effect(
      () => {
        const activeTab = this.tabs().find((tab) => tab.isActive());
        if (activeTab) {
          switch (activeTab.label()) {
            case ORDER_STATE_TRANSLATION[ORDER_STATE.VERIFIED]:
              this.pendingOrderStateService.setPendingOrderState(ORDER_STATE.VERIFIED);
              break;
            case ORDER_STATE_TRANSLATION[ORDER_STATE.CONFIRM]:
              this.pendingOrderStateService.setPendingOrderState(ORDER_STATE.CONFIRM);
              break;
          }
        }
      },
      { allowSignalWrites: true } as CreateEffectOptions,
    );
  }

  ngOnInit() {
    this.initializeTabConfig();
    this.openOnboardingBottomSheet();
  }

  initializeTabConfig(): void {
    this.tabs.set([
      {
        label: signal(ORDER_STATE_TRANSLATION[ORDER_STATE.VERIFIED] || ''),
        isActive: signal(true),
        component: signal(SellerPendingOrderComponent),
      },
      {
        label: signal(ORDER_STATE_TRANSLATION[ORDER_STATE.CONFIRM] || ''),
        isActive: signal(false),
        component: signal(SellerPendingOrderComponent),
      },
    ]);
  }

  openOnboardingBottomSheet() {
    if (!this.storageService.getEscrowSellerOnboarding()) {
      this.bottomSheetService.openBottomSheet(SellerOnboardingOrderComponent, {});
    }
  }
}
