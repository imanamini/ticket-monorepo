import {Component, Input, OnInit} from '@angular/core';
import {Dir} from "@angular/cdk/bidi";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserInterfaceModule} from "../../../user-interface/user-interface.module";
import {WalletApiService} from "../../../api/wallet-api.service";
import {Router} from "@angular/router";
import {MessageService} from "../../../core/services/message.service";
import {HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-test-cash-out',
  standalone: true,
  imports: [
    Dir,
    ReactiveFormsModule,
    UserInterfaceModule,
    FormsModule
  ],
  templateUrl: './test-cash-out.component.html',
  styleUrl: './test-cash-out.component.scss'
})
export class TestCashOutComponent implements OnInit{
  @Input()
  accessToken: string;

  cellNumber = '09';

  providerId: string;

  gettingToken = false;

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

    const params = {
      callbackUrl: window.location.origin,
      providerId: this.providerId,
      cellNumber: this.cellNumber
    };

    this.gettingToken = true;
    this.wallet.getCashOutTicket(params, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken),
    }).subscribe(response => {
      this.gettingToken = false;
      this.router.navigateByUrl('/cash-out/' + response.ticket);
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
