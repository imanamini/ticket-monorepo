import { Component, Input, OnInit } from '@angular/core';
import { WalletApiService } from '../../../api/wallet-api.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { MessageService } from '../../../core/services/message.service';
import { ApiResult } from '../../../api/models/api-result';

@Component({
  selector: 'app-test-direct-debit',
  templateUrl: './test-direct-debit.component.html',
  styleUrls: ['./test-direct-debit.component.scss']
})
export class TestDirectDebitComponent implements OnInit {

  cellNumber = '09';

  providerId: string;

  @Input()
  accessToken: string;

  gettingToken = false;

  customToken: string;

  constructor(
    private wallet: WalletApiService,
    private router: Router,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.providerId = Math.random().toString(32).substr(2) + Math.random().toString(32).substr(2);
  }

  getTestTicket() {
    const params = {redirectUrl: window.location.origin, cellNumber: this.cellNumber, providerId: this.providerId};
    this.gettingToken = true;
    const token: string = this.customToken ? this.customToken : this.accessToken;

    this.wallet.getDirectDebitTicket(params,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)})
      .subscribe(response => {
          this.gettingToken = false;
          this.router.navigateByUrl('/direct-debit/management/' + response.ticket).then();
        },
        (error: ApiResult) => {
          this.gettingToken = false;
          if (error.error && error.error.result) {
            this.messageService.showErrorIfExists(error);
            return;
          }
          this.messageService.showErrorMessage('بروز خطا. لطفا مجددا تلاش کنید');
        }
      );
  }
}
