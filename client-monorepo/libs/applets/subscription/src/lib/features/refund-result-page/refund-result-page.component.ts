import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { RefundCapTableComponent } from '../../components/subscription-refund/refund-cap-table/refund-cap-table.component';
import { REFUND_RESULT_STATUS, RefundResult } from '@client-monorepo/common/subscription';
import { SubscriptionRefundService } from '../../data-access/services/subscription-refund.service';
import { Router } from '@angular/router';
import { SubscriptionNavigationService } from '../../data-access/services/subscription-navigation.service';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PlansService } from '../../data-access/services/plans.service';

@Component({
  selector: 'subscription-applet-refund-result-page',
  templateUrl: './refund-result-page.component.html',
  standalone: true,
  styleUrl: './refund-result-page.component.scss',
  imports: [NgClass, RefundCapTableComponent, NgxButtonComponent],
})
export class RefundResultPageComponent {
  refundResult!: RefundResult | null;
  navigationService = inject(SubscriptionNavigationService);
  backHandler = inject(BackHandlerService);
  private plansService = inject(PlansService);

  constructor(
    private subscriptionRefundService: SubscriptionRefundService,
    private router: Router,
  ) {
    this.refundResult = this.subscriptionRefundService.refundResult.getValue();
    this.checkRefundResult();
  }

  checkRefundResult(): void {
    if (!this.refundResult) {
      this.router.navigate(['subscription/subscription-management']).then();
    }
  }

  handleClickButton(): void {
    switch (this.refundResult?.status) {
      case REFUND_RESULT_STATUS.SUCCESS:
        this.plansService.resetUserSubscriptionPurchaseState();
        this.navigationService.exit();
        break;
      case REFUND_RESULT_STATUS.FAILED:
        this.backHandler.goBack();
        break;
    }
  }
}
