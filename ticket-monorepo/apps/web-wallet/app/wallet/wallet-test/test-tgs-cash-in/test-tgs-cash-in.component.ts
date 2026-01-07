import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {TgsSelectFeatureBody} from '../../../api/models/tgs-select-feature-body';
import {TgsSelectFeatureResponse} from '../../../api/models/tgs-select-feature-response';
import {TgsGetTicketBody} from '../../../api/models/tgs-get-ticket-body';
import {TicketType} from '../../../api/emuns/ticket-type.emun';
import {TgsUserType} from '../../../api/emuns/tgs-user-type.emun';
import {MessageService} from '../../../core/services/message.service';
import {HttpErrorResponse} from '@angular/common/http';
import {PERSISTENT_STORAGE_KEYS} from '../../../core/constants';
import {StorageService} from '../../../core/services/storage.service';
import {Subscription} from 'rxjs';
import {TgsCashInStateInterface} from './tgs-cash-in-state.interface';
import {TgsTicketResponseInterface} from '../../../api/models/tgs-ticket-response.interface';
import {NewUpgService} from "../../../api/services/new-upg/new-upg.service";
import {WalletApiService} from "../../../api/wallet-api.service";

@Component({
  selector: 'app-test-tgs-cash-in',
  templateUrl: './test-tgs-cash-in.component.html',
  styleUrls: ['./test-tgs-cash-in.component.scss']
})
export class TestTgsCashInComponent implements OnDestroy {
  @ViewChild('redirectPaymentForm', {
    static: false
  })
  redirectPaymentForm: ElementRef<HTMLFormElement>;

  state: TgsCashInStateInterface = {
    cellNumber: '09',
    amount: 10000
  };

  payUrl: string;

  loading = false;

  subscriptions: Subscription[] = [];

  constructor(
    private walletApiService: WalletApiService,
    private newUpgService: NewUpgService,
    private messageService: MessageService,
    private storageService: StorageService) {
  }

  private static randomProvideId(): string {
    return Math.random().toString(32).substr(2) + Math.random().toString(32).substr(2);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  getTest(): void {
    this.getTicket();
  }

  private getTicket(): void {
    this.loading = true;
    const subscription = this.newUpgService.getTgsTicket(this.tgsTicketApiBody())
      .subscribe((result: TgsTicketResponseInterface) => {
        this.getCashInInfo(result.ticket);
      }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.onError(error);
      });
    this.subscriptions.push(subscription);
  }

  private tgsTicketApiBody(): TgsGetTicketBody {
    return {
      type: TicketType.CASH_IN,
      cellNumber: this.state.cellNumber,
      amount: this.state.amount,
      providerId: TestTgsCashInComponent.randomProvideId(),
      callbackUrl: window.location.origin,
      additionalInfo: {
        userType: TgsUserType.IDENTIFIED
      }
    };
  }

  private getCashInInfo(ticketString: string): void {
    const state: TgsSelectFeatureBody = {
      ticket: ticketString,
      featureName: 253
    };

    const subscription = this.newUpgService.tgsSelectFeature(state)
      .subscribe(
        (result: TgsSelectFeatureResponse) => {
          this.payUrl = result.payUrl;
          this.redirectToIPG(ticketString);
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
          this.onError(error);
        });
    this.subscriptions.push(subscription);
  }

  private onError(error: HttpErrorResponse): void {
    if (error.error && error.error.result) {
      this.messageService.showErrorIfExists(error);
    } else {
      this.messageService.showErrorMessage('بروز خطا. لطفا مجددا تلاش کنید');
    }
  }

  private redirectToIPG(ticket: string): void {
    const subscription = this.walletApiService.checkForCashInInput(this.state.amount, ticket)
      .subscribe(() => {
        this.storageService.persist(PERSISTENT_STORAGE_KEYS.CASH_IN, ticket);
        this.redirectPaymentForm.nativeElement.submit();
        this.loading = false;
      }, (e) => {
        this.messageService.showErrorIfExists(e);
        this.loading = false;
      });
    this.subscriptions.push(subscription);
  }
}
