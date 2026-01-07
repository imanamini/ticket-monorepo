import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PageEnum} from '../../enums/page.enum';
import {PaymentResultEnum} from '../../../../api/emuns/payment-result.enum';
import {UrlService} from '../../services/url.service';
import {GetCallbackUrl} from '../../../../utils/storage';
import {PageManagementService} from '../../services/page-management.service';
import {UpgFeatureName} from '../../../../api/emuns/upg-feature-name.emun';
import {BottomSheetService} from '../../services/bottom-sheet.service';
import {NavigateToExternalUrl} from '../../../../utils/navigation';
import {FlagEnum} from '../../enums/flag.enum';
import {CashInRedirectHandling} from './cash-in-redirect-handling';
import * as Sentry from "@sentry/angular-ivy";
import {ConvertorDeepLinkToHttpsProtocol} from "../../services/convertor-deeplink-url.service";

@Component({
  selector: 'app-redirect-cash-in',
  templateUrl: './redirect-cash-in.component.html',
})
export class RedirectCashInComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private urlService = inject(UrlService);
  private pageManagementService = inject(PageManagementService);
  private bottomSheetService = inject(BottomSheetService);
  private convertorDeepLinkToHttpsProtocol = inject(ConvertorDeepLinkToHttpsProtocol);
  public loading: boolean = true;

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module')
  }

  ngOnInit(): void {
    this.checkStatus();
  }

  private checkStatus(): void {
    const data: string = this.activatedRoute.snapshot.queryParams['data'];
    const status: PaymentResultEnum = new CashInRedirectHandling().checkCashInStatus(data);
    switch (status) {
      case PaymentResultEnum.FAILURE:
        this.failed();
        break;
      case PaymentResultEnum.SUCCESS:
        this.success().then();
        break;
    }
  }

  private failed(): void {
    // User has to return to merchant url.
    this.loading = true;
    let callbackUrl: string = GetCallbackUrl();
    callbackUrl = this.convertorDeepLinkToHttpsProtocol.convert(callbackUrl);
    NavigateToExternalUrl(callbackUrl);
  }

  private async success(): Promise<void> {
    // In this flow user can't choose a new feature again, so we have to disable bottom sheet dismiss.
    await this.bottomSheetService.updateDisableCloseFlag();
    // user has to go to wallet pay component automatically, so we add WALLET_CASH_IN_IPG method to query param and add flag to detect we have come from cashIn .
    await this.urlService.addMethodQueryParam(UpgFeatureName.WALLET_CASH_IN_IPG);
    await this.urlService.addFlagQueryParam(FlagEnum.CASH_IN_REDIRECT);
    await this.urlService.removeDataQueryParam();
    this.pageManagementService.implement(PageEnum.PAYMENT_METHOD);
  }

}
