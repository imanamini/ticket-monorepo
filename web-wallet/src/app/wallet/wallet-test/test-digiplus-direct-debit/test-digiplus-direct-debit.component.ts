import { Component } from '@angular/core';
import { WalletApiService } from '../../../api/wallet-api.service';
import { Router } from '@angular/router';
import { ActionTypeEnum } from '../../../api/emuns/direct-debit-ticket-info-action-type.enum';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DirectDebitGenerateTicketBody } from '../../../api/models/direct-debit-generate-ticket-body';
import { MessageService } from '../../../core/services/message.service';
import { DurationTimeUnitEnum } from '../../../api/emuns/duration-time-unit.enum';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-test-digiplus-direct-debit',
  templateUrl: './test-digiplus-direct-debit.component.html',
  styleUrls: ['./test-digiplus-direct-debit.component.scss']
})
export class TestDigiplusDirectDebitComponent {
  public loading = false;
  public DurationTimeUnitEnum = DurationTimeUnitEnum;
  public token: string;

  public state: DirectDebitGenerateTicketBody = {
    providerId: '',
    redirectUrl: 'https://uatweb.mydigipay.info/web-pay',
    cellNumber: '09166192673',
    maxDailyTransactionAmount: 500000,
    maxDailyTransactionCount: 10,
    maxMonthlyTransactionCount: 300,
    action: {
      type: ActionTypeEnum.DEFAULT
    },
    duration: {
      timeUnit: DurationTimeUnitEnum.YEAR,
      count: 1
    }
  };

  constructor(
    private wallet: WalletApiService,
    private router: Router,
    private messageService: MessageService,
    private storageService: StorageService
  ) {
    this.setProviderId();
    this.setToken();
  }

  public generateTicket(): void {
    this.loading = true;
    this.wallet.getDirectDebitTicket(this.state, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token)})
      .subscribe(
        response => {
          this.loading = false;
          this.router.navigateByUrl('/direct-debit/external/withdrawal-detail/' + response.ticket).then();
        },
        (httpError: HttpErrorResponse) => {
          this.loading = false;
          this.handleErrorOnGenerateTicket(httpError);
        }
      );
  }

  public setTimeUnit(event: any): void {
    // @ts-ignore
    this.state.duration.timeUnit = event.target.value;
  }

  private handleErrorOnGenerateTicket(httpError: HttpErrorResponse): void {
    if (httpError.error && httpError.error.result) {
      this.messageService.showErrorIfExists(httpError);
      return;
    }
    this.messageService.showErrorMessage('بروز خطا. لطفا مجددا تلاش کنید');
  }

  private setProviderId(): void {
    this.state.providerId = Math.random().toString(32).substr(2) + Math.random().toString(32).substr(2);
  }

  private setToken(): void {
    this.token = this.storageService.getAccessToken();
  }
}
