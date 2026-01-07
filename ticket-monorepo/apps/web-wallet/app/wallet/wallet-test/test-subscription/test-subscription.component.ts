import { Component, Input, OnInit } from '@angular/core';
import { WalletApiService } from '../../../api/wallet-api.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-test-subscription',
  templateUrl: './test-subscription.component.html',
  styleUrls: ['./test-subscription.component.scss']
})
export class TestSubscriptionComponent implements OnInit {

  cellNumber = '09';

  templateGroupId = '';

  subscriptionGroups = [];

  providerId: string;

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
    this.providerId = Math.random().toString(32).substr(2) + Math.random().toString(32).substr(2);
    this.wallet.getSubscriptionAllGroups({}, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken),
    }).subscribe((response) => {
      this.subscriptionGroups = response.groups;
    });
  }

  getTestTicket() {
    const params = {
      providerId: this.providerId,
      templateGroupId: this.templateGroupId,
      redirectUrl: window.location.origin,
      cellNumber: this.cellNumber
    };
    this.gettingToken = true;
    this.wallet.getSubscriptionTicket(params, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken),
    }).subscribe(response => {
      this.gettingToken = false;
      this.router.navigateByUrl('/subscription/' + response.ticket);
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
