import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { Store, StorePaymentMethod, StoreType } from '@client-monorepo/stores';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Router } from '@angular/router';

@Component({
  selector: 'stores-applet-store-overview',
  standalone: true,
  imports: [CommonModule, NgxBadgeModule, NgxSkeletonLoadingComponent, ApiImageModule, NgxButtonComponent],
  templateUrl: './store-overview.component.html',
  styleUrl: './store-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreOverviewComponent {
  router = inject(Router);
  store = input<Store>();
  isBlurred = input<boolean>(false);
  hasWebsite = computed<boolean | undefined>(() => {
    return !!this.store()?.types.includes(StoreType.ONLINE);
  });
  hasShop = computed<boolean | undefined>(() => {
    return !!this.store()?.types.includes(StoreType.ONSITE) && this.showBranchesButton();
  });
  isDisabled = computed(() => this.store()?.state?.disabled);
  showBranchesButton = input(false);

  actionHandler = inject(ActionHandlerService);
  eventManagementService = inject(EventManagementService);
  paymentMethodBadges = computed<string[]>(() => {
    const badges: string[] = [];
    const hasBnpl = this.store()?.paymentMethods.includes(StorePaymentMethod.BNPL);
    const hasCredit = this.store()?.paymentMethods.includes(StorePaymentMethod.C_CREDIT);
    const isOnline = this.store()?.types.includes(StoreType.ONLINE);
    const isOnsite = this.store()?.types.includes(StoreType.ONSITE);
    const paymentTypeCode = (hasBnpl ? '1' : '0') + (hasCredit ? '1' : '0');
    const storeTypeCode = (isOnline ? '1' : '0') + (isOnsite ? '1' : '0');
    const paymentTypeMap: { [key: string]: string } = {
      '11': 'خرید با وام و اعتبار',
      '10': 'خرید اعتباری',
      '01': 'خرید با وام',
    };
    const storeTypeMap: { [key: string]: string } = {
      '11': 'آنلاین و حضوری',
      '10': 'آنلاین',
      '01': 'حضوری',
    };
    if (paymentTypeMap[paymentTypeCode]) {
      badges.push(paymentTypeMap[paymentTypeCode]);
    }
    if (storeTypeMap[storeTypeCode]) {
      badges.push(storeTypeMap[storeTypeCode]);
    }
    return badges;
  });

  goToWebsite(): void {
    this.eventManagementService.triggerEvent(
      {
        eventType: 'redirect',
        data: {
          to: (this.store()?.landingUrl as string) ?? (this.store()?.url as string),
          host: this.store()?.url as string,
        },
        meta: `storeTrackingCode:${this.store()?.trackingCode}`,
        breadCrumbs: ['stores-overview', 'store-landing'],
      },
      true,
    );
    this.actionHandler.handle({
      type: ActionType.REDIRECT,
      payload: {
        url: (this.store()?.landingUrl as string) ?? (this.store()?.url as string),
        params: {
          external: true,
          'dp-source': 'DP',
          'dp-medium': 'merchant',
          'dp-type': 'merchant',
        },
      },
    });
  }

  goToBranches(): void {
    this.router.navigate(['stores', this.store()?.trackingCode, 'branches']);
  }

  goToViolationReport(): void {
    this.router.navigate(['stores', 'violation'], { queryParams: { trackingCode: this.store()?.trackingCode } });
  }
}
