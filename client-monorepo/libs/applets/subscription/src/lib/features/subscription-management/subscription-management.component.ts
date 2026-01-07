import { Component, computed, inject, signal } from '@angular/core';
import {
  PlanServices,
  SERVICE_PLAN_STATUS,
  SERVICE_STATUS,
  SERVICES_TAGS_TYPE,
  SERVICES_TYPE,
  SubscriptionPlan,
} from '@client-monorepo/common/subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SubscriptionRefundComponent } from '../../components/subscription-refund/subscription-refund.component';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { SubscriptionManagementService } from '../../data-access/services/subscription-management.service';
import { SubscriptionBadgeComponent } from '../../components/subscription-badge/subscription-badge.component';
import { BnplServiceComponent } from '../../components/bnpl-service/bnpl-service.component';
import { CreditServiceComponent } from '../../components/credit-service/credit-service.component';
import { OtherServicesComponent } from '../../components/other-services/other-services.component';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { UiPlanServicesComponent } from '../../components/ui-plan-services/ui-plan-services/ui-plan-services.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { UserActionsComponent } from '../../components/user-actions/user-actions.component';
import { DpCardServicesComponent } from '../../components/dp-card-service/dp-card-service.component';

@Component({
  selector: 'subscription-applet-subscription-management',
  templateUrl: './subscription-management.component.html',
  standalone: true,
  imports: [
    PageLayoutComponent,
    UserActionsComponent,
    SubscriptionBadgeComponent,
    BnplServiceComponent,
    CreditServiceComponent,
    OtherServicesComponent,
    UiPlanServicesComponent,
    DpCardServicesComponent,
  ],
  styleUrls: ['./subscription-management.component.scss'],
})
export class SubscriptionManagementComponent {
  subscriptionManagementService = inject(SubscriptionManagementService);
  bottomSheetService = inject(NgxBottomSheetService);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  private backHandlerService = inject(BackHandlerService);
  protected readonly SERVICES_TYPE = SERVICES_TYPE;
  protected readonly SERVICE_PLAN_STATUS = SERVICE_PLAN_STATUS;

  plan = signal<SubscriptionPlan>({} as SubscriptionPlan);
  isLoading = true;
  isSuccessTransaction = false;
  subscriptions: Subscription[] = [];
  nextActionServices!: PlanServices[];
  EXCLUDED_TYPES = [SERVICES_TYPE.COIN, SERVICES_TYPE.CASHBACK, SERVICES_TYPE.PURCHASE_CASHBACK];
  NEXT_ACTION_BNPL_CREDIT_TYPES = [SERVICES_TYPE.CREDIT, SERVICES_TYPE.BNPL_4PAY, SERVICES_TYPE.BNPL_1PAY];
  otherServices = signal<PlanServices[]>([]);
  merchantServices = signal<PlanServices[]>([]);

  actionText = computed(() => {
    if (
      this.plan()?.refundDetail?.isRefundable ||
      this.plan()?.refundDetail?.isClosable ||
      this.plan()?.status === SERVICE_PLAN_STATUS.REFUNDING
    ) {
      return this.plan()?.status === SERVICE_PLAN_STATUS.REFUNDING ? 'در انتظار لغو...' : 'لغو اشتراک';
    }
    return null;
  });

  protected readonly SERVICE_STATUS = SERVICE_STATUS;

  constructor() {
    this.checkHasQueryParam();
    this.getPlanData();
  }

  private checkHasQueryParam(): void {
    const getQueryParam = this.route.snapshot.queryParams['result'];
    if (getQueryParam === 'success') {
      this.isSuccessTransaction = true;
    }
  }

  private getPlanData(): void {
    this.subscriptionManagementService
      .getUserCurrentPlan()
      .then((plan: SubscriptionPlan) => {
        if (plan) {
          this.plan.set(plan);
          this.nextActionServices = this.getNextActionServices(plan);
          this.setOtherServices();
          this.setMerchantServices();
          this.isLoading = false;
        }
      })
      .catch(() => {
        this.router.navigateByUrl('subscription', { replaceUrl: true }).then();
      });
  }

  getNextActionServices(plan: SubscriptionPlan) {
    return plan.services.filter((service) => {
      // For BNPL/Credit services: must be rejected with a next action data from backend
      if (this.NEXT_ACTION_BNPL_CREDIT_TYPES.includes(service.type)) {
        return service.status === SERVICE_STATUS.REJECTED && service.nextAction;
      }

      // For DPCARD_ISUUANCE service: must not be used
      if (service.type === SERVICES_TYPE.DPCARD_ISUUANCE) {
        return service.status !== SERVICE_STATUS.USED;
      }

      // All other service types are excluded
      return false;
    });
  }

  setOtherServices(): void {
    const filterOtherServices: PlanServices[] = this.plan()?.services.filter((service) => this.EXCLUDED_TYPES.includes(service.type));
    this.otherServices.set(filterOtherServices || []);
  }

  setMerchantServices(): void {
    const filterMerchantServices: PlanServices[] | undefined = this.plan()?.services.filter((service) =>
      service?.tags?.includes(SERVICES_TAGS_TYPE.CASH_OFFERS),
    );
    const filterCashbackType: PlanServices[] = filterMerchantServices?.filter((service) => service.type !== SERVICES_TYPE.CASHBACK);
    this.merchantServices.set(filterCashbackType || []);
  }

  handleRefund(): void {
    this.bottomSheetService.openBottomSheet(
      SubscriptionRefundComponent,
      {
        plan: this.plan(),
      },
      {
        maxHeight: '90%',
        overflow: 'auto',
        noPadding: true,
      },
    );
    const bottomSheetSubscriber = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetSubscriber.unsubscribe();
      const result = this.bottomSheetService.outputData();
      if (!result) {
        return;
      }
      if (result) {
        this.router.navigateByUrl('subscription/refund').then();
      }
    });
  }

  customBackAction(): void {
    if (this.isSuccessTransaction) {
      this.backHandlerService.setCustomBackUrl('/');
    }
    this.backHandlerService.goBack();
  }
}
