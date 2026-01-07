import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalClient } from '@digipay/ng-payment';
import { RedirectFormData, RedirectService } from '../../../core/services/redirect.service';
import { TicketService } from './ticket.service';
import {GetCallbackUrl} from "../../../utils/storage";

@Injectable()
export class DirectDebitNavigationService {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ticketService: TicketService,
    private redirectService: RedirectService) {
  }

  public navigateToBackUpAccount(name: string = null, value: any = null): void {
    const ticket: string = this.ticketService.get();
    this.router.navigate([`direct-debit/external/backup-account/${ticket}`],
      {
        queryParams: {
          ...(name ? {[name]: value} : {})
        }
      }).then();
  }

  public navigateToWithdrawal(name: string = null, value: any = null): void {
    const ticket: string = this.ticketService.get();
    this.router.navigate([`direct-debit/external/withdrawal-detail//${ticket}`],
      {
        queryParams: {
          ...(name ? {[name]: value} : {})
        }
      }).then();
  }

  public satQueryParam(name: string, value: any): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {[name]: value},
        skipLocationChange: false
      }).then();
  }

  public async navigateToMerchant(redirectFormData: Array<RedirectFormData>, ticket?: string): Promise<void> {
    SignalClient.close('direct-debit');
    const callbackUrl: string = GetCallbackUrl();
    this.redirectService.url.next(callbackUrl);
    this.redirectService.setAndRedirect(redirectFormData ? redirectFormData : []);
  }
}
