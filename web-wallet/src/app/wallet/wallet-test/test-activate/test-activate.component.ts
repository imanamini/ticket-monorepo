import { Component, Input, OnInit } from '@angular/core';
import { WalletApiService } from '../../../api/wallet-api.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-test-activate',
  templateUrl: './test-activate.component.html',
  styleUrls: ['./test-activate.component.scss']
})
export class TestActivateComponent implements OnInit {

  cellNumber = '09';

  providerId: string;

  @Input()
  accessToken: string;

  gettingToken = false;

  constructor(
    private wallet: WalletApiService,
    private router: Router,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.providerId = Math.random().toString(32).substr(2) + Math.random().toString(32).substr(2);
  }

  getTestTicket() {
    const params = {
      redirectUrl: window.location.origin,
      cellNumber: this.cellNumber,
    };
    this.gettingToken = true;
    this.wallet.getActivationTicket(params, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken),
    }).subscribe(response => {
      this.gettingToken = false;
      this.router.navigateByUrl('/activation/' + response.ticket);
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
