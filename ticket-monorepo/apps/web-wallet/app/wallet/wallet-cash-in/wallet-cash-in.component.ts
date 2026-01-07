import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FAILURE_DATA } from '../../core/constants';
import { RedirectService } from '../../core/services/redirect.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { MarketingAnalyticsService } from '../../core/services/marketing-analytics.service';
import { LayoutService } from '../../core/services/layout.service';
import {WalletApiService} from "../../api/wallet-api.service";

@Component({
  selector: 'app-wallet-cash-in',
  templateUrl: './wallet-cash-in.component.html',
  styleUrls: ['./wallet-cash-in.component.scss']
})
export class WalletCashInComponent implements OnInit {

  ticket: string;

  constructor(
    private route: ActivatedRoute,
    private redirect: RedirectService,
    private pageTitleService: PageTitleService,
    private marketingAnalyticsService: MarketingAnalyticsService,
    private layoutService: LayoutService,
    private cdr: ChangeDetectorRef,
    private walletApi: WalletApiService,
  ) {
    this.pageTitleService.setTitle('افزایش موجودی کیف‌پول');
  }

  ngOnInit() {
    this.ticket = this.route.snapshot.paramMap.get('ticket');
    this.cdr.detectChanges();
    this.createCashinInitiateFlag();
  }

  createCashinInitiateFlag(): void {
    this.walletApi.walletFlag(this.ticket , 'OldCashIn').subscribe();
  }

  cancelCashIn() {
    this.marketingAnalyticsService.triggerEvent('cash_in', 'user click on close button');
    this.redirect.setAndRedirect(FAILURE_DATA);
  }
}
