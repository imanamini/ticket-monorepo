import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CashInRedirectHandling } from './cash-in-redirect-handling';
import * as Sentry from '@sentry/angular-ivy';
import { UrlService } from '../../data-access/services/url.service';
import { PageManagementService } from '../../data-access/services/page-management.service';
import { PaymentResultStatus } from '@client-monorepo/payment/purchase';
import { FlagEnum } from '../../data-access/models/flag.enum';
import { PageEnum } from '../../data-access/models/page.enum';
import { APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { CommonModule } from '@angular/common';
import { StorageService } from '@client-monorepo/common/utilities';
import { removeUrlOrigin } from '../../utils/operating-on-url';
import { AutoSubmitService } from '../../data-access/services/auto-submit.service';
import { filter } from 'rxjs';

@Component({
  selector: 'payment-checkout-redirect-cash-in',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './redirect-cash-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedirectCashInComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private urlService = inject(UrlService);
  private pageManagementService = inject(PageManagementService);
  private storageService = inject(StorageService);
  private autoSubmitService = inject(AutoSubmitService);
  router = inject(Router);

  loading = signal(true);

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module');
  }

  ngOnInit(): void {
    this.checkStatus();
  }

  private checkStatus(): void {
    const data: string = this.activatedRoute.snapshot.queryParams['data'];
    const status: PaymentResultStatus | undefined = new CashInRedirectHandling().checkCashInStatus(data);
    switch (status) {
      case PaymentResultStatus.FAILED:
        this.failed();
        break;
      case PaymentResultStatus.SUCCESS:
        this.success().then();
        break;
    }
  }

  private failed(): void {
    // User has to return to merchant url.
    this.loading.set(true);
    const callbackUrl = this.storageService.getCallbackUrl() || '';
    const removedUrlOrigin = removeUrlOrigin(callbackUrl);

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.router.navigate([removedUrlOrigin], { queryParams: {}, queryParamsHandling: 'merge', replaceUrl: true });
    });
  }

  private async success(): Promise<void> {
    // user has to go to wallet pay component automatically, so we add WALLET_CASH_IN_IPG method to query param and add flag to detect we have come from cashIn .
    await this.urlService.addMethodQueryParam(APP_ACTIONS.WALLET_CASH_IN_IPG);
    await this.urlService.addFlagQueryParam(FlagEnum.CASH_IN_REDIRECT);
    await this.urlService.removeDataQueryParam();
    this.pageManagementService.implement(PageEnum.PAYMENT_METHOD);
    this.autoSubmitService.isRedirectCashIn.set(true);
  }
}
