import { Component, Input, OnInit } from '@angular/core';
import { WalletApiService } from '../../../api/wallet-api.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-test-manage-subscription',
  templateUrl: './test-manage-subscriptions.component.html',
  styleUrls: ['./test-manage-subscriptions.component.scss']
})
export class TestManageSubscriptionsComponent implements OnInit {

  cellNumber = '09';

  templateGroupId = '';

  subscriptionGroups = [];

  @Input()
  accessToken: string;

  gettingToken = false;

  constructor(
    private wallet: WalletApiService,
    private router: Router,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.wallet.getSubscriptionAllGroups({}, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken),
    }).subscribe((response) => {
      this.subscriptionGroups = response.groups;
    });
  }

  getTestTicket() {
    const params = {
      redirectUrl: window.location.origin,
      cellNumber: this.cellNumber
    };
    this.gettingToken = true;
    this.wallet.getSubscriptionTicket(params, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken),
    }).subscribe(response => {
      this.gettingToken = false;
      this.wallet.inAppTac(response.ticket).subscribe(tacResponse => {
        this.wallet.getSubscriptionTicketInfo(response.ticket, tacResponse).subscribe((info) => {
          this.router.navigateByUrl('/manage-subscriptions/' + response.ticket + '/' + info.ticketType);
        });
      });
    }, e => {
      this.gettingToken = false;
      if (e.error && e.error.result) {
        this.messageService.showErrorIfExists(e);
      } else {
        this.messageService.showErrorMessage('بروز خطا. لطفا مجددا تلاش کنید');
      }
    });
  }
}
