import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WalletApiService} from '../../api/wallet-api.service';
import {TacResponse} from '../../api/models/tac.response';
import {RedirectService} from '../../core/services/redirect.service';
import {StorageService} from '../../core/services/storage.service';
import {PageTitleService} from '../../core/services/page-title.service';
import {GetCallbackUrl, SaveCallbackUrl} from "../../utils/storage";

@Component({
  selector: 'app-wallet-activate',
  templateUrl: './wallet-activate.component.html',
  styleUrls: ['./wallet-activate.component.scss']
})
export class WalletActivateComponent implements OnInit {

  preparingData = true;

  tacInfo: TacResponse;

  ticket: string;

  constructor(
    private route: ActivatedRoute,
    private walletApi: WalletApiService,
    private redirect: RedirectService,
    private storage: StorageService,
    private pageTitleService: PageTitleService,
  ) {
    this.pageTitleService.setTitle('فعال سازی کیف پول');
  }

  ngOnInit() {
    const ticket = this.getTicket();
    if (!ticket) {
      this.backToSafePlace();
      return;
    }

    this.ticket = ticket;

    this.storage.put({
      ticket
    });

    this.setRedirectUrlIfAlreadyExist();

    this.walletApi.inAppTac(ticket).subscribe(info => {
      this.tacInfo = info;
      this.preparingData = false;
      this.walletApi.getTicketInfo(this.ticket, this.tacInfo).subscribe(ticketInfo => {
        SaveCallbackUrl(ticketInfo.redirectUrl);
        this.redirect.url.next(ticketInfo.redirectUrl);

        this.preparingData = false;
      });
    }, e => {
      this.backToSafePlace();
    });
  }

  private backToSafePlace() {
    setTimeout(() => {
      this.redirect.setAndRedirect([]);
    }, 150);
  }

  /**
   * Get ticket from URL
   */
  private getTicket() {
    return this.route.snapshot.paramMap.get('ticket');
  }

  /**
   * Cancel activation
   */
  cancelActivation() {
    this.backToSafePlace();
  }

  private setRedirectUrlIfAlreadyExist(): void {
    if (GetCallbackUrl()) {
      this.redirect.url.next(GetCallbackUrl());
    }
  }
}
