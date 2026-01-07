import { Component, OnInit, OnDestroy } from '@angular/core';
import { WalletApiService } from '../../../api/wallet-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { SubscriptionContractResponse } from '../../../api/models/subscription-contracts.response';
import { SubscContractDialogComponent } from '../../../user-interface/dialogs/subsc-contract-dialog/subscription-dialog.component';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { RedirectService } from '../../../core/services/redirect.service';
import { MessageService } from '../../../core/services/message.service';
import { GA_SUBSCRIPTION_ID } from '../../../api/constants/ga-subscription-id';

@Component({
  selector: 'app-cancel-subscription',
  templateUrl: './manage-subscriptions.component.html',
  styleUrls: ['./manage-subscriptions.component.scss']
})
export class ManageSubscriptionsComponent implements OnInit, OnDestroy {

  contracts: Array<SubscriptionContractResponse>;

  isLoading = false;

  cancellationLoading = false;

  cancelContractQueue = [];

  showAllTemplates = false;

  ticketType = '1';

  tokenExpired = false;

  GA_SUBSCRIPTION_MANAGEMENT_ID = GA_SUBSCRIPTION_ID.MANAGEMENT;

  constructor(
    private router: Router,
    private overlay: Overlay,
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    private walletApi: WalletApiService,
    private storageService: StorageService,
    private messageService: MessageService,
    private redirectService: RedirectService,
  ) {
    this.windowResizeCallback = this.windowResizeCallback.bind(this);
  }

  ngOnInit() {
    const ticket = this.getTicket();

    this.ticketType = this.getTicketType();

    this.storageService.put({ticket});

    this.isLoading = true;

    this.getContracts();

    if (this.ticketType === '2') {
      this.walletApi.inAppTac(this.getTicket()).subscribe((response) => {
        this.walletApi.getSubscriptionTicketInfo(this.getTicket(), response).subscribe((r) => {
          this.redirectService.url.next(r.callbackUrl);
        }, () => {
        });
      });
    }

    window.addEventListener('resize', this.windowResizeCallback);
    this.setCallbackUrl(localStorage.getItem('subscCallbackUrl'));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.windowResizeCallback);
  }

  windowResizeCallback() {
    this.showAllTemplates = window.matchMedia('(max-width: 812px)').matches;
  }

  getContracts() {
    this.isLoading = true;
    this.tokenExpired = false;
    this.walletApi.getSubscriptionActivities().subscribe((response) => {
      this.contracts = response.contracts;
    }, (e) => {
      if (e && e.status === 401) {
        this.tokenExpired = true;
        this.messageService.showErrorMessage('خطا در اعتبارسنجی');
        setTimeout(() => {
          this.callbackToMerchant();
        }, 3000);
      }
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  showCancelDialog(contract) {
    this.cancelContractDialog(contract).afterClosed().subscribe((data) => {
      if (data) {
        this.cancelContractQueue.push(data);
        contract.setCanceled = true;
      }
    });
  }

  private cancelContractDialog(contractData) {
    return this.matDialog.open(SubscContractDialogComponent, {
      width: '400px',
      maxWidth: '90%',
      maxHeight: '90vh',
      autoFocus: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: {
        id: {
          submit: GA_SUBSCRIPTION_ID.MANAGEMENT.CONFIRM_CONTRACT_CANCELLATION_CLICK,
          cancel: GA_SUBSCRIPTION_ID.MANAGEMENT.ABORT_CONTRACT_CANCELLATION_CLICK
        },
        contractInfo: contractData as SubscriptionContractResponse
      }
    });
  }

  execCancelQueue() {
    this.isLoading = true;
    let requestsCount = this.cancelContractQueue.length;
    let canceledSuccessMessage = '';
    this.cancelContractQueue.forEach((contractId) => {
      this.isLoading = true;
      this.walletApi.cancelSubscription(contractId).subscribe((response) => {
        canceledSuccessMessage = response.result.message || 'عملیات با موفقیت انجام شد';
      }, (e) => {
        this.isLoading = false;
        if (e.error && e.error.result) {
          this.messageService.showErrorIfExists(e);
        } else {
          this.messageService.showErrorMessage('بروز خطا. لطفا مجددا تلاش کنید');
        }
      }, () => {
        requestsCount--;
        if (requestsCount === 0) {
          this.messageService.showErrorMessage(canceledSuccessMessage);
          this.getContracts();
        }
      });
    });
  }

  reverseCancel(contract) {
    contract.setCanceled = false;
    this.cancelContractQueue = this.cancelContractQueue.filter(item => item !== contract.contractId);
  }

  callbackToMerchant() {
    if (this.ticketType === '1' && !this.tokenExpired) {
      this.router.navigateByUrl('/subscription/' + this.getTicket());
    } else {
      this.redirectService.setAndRedirect([]);
    }
  }

  /**
   * Get ticket from URL
   */
  private getTicket() {
    return this.route.snapshot.paramMap.get('ticket');
  }

  /**
   * Get ticket type from URL
   */
  private getTicketType() {
    return this.route.snapshot.paramMap.get('ticketType');
  }

  setCallbackUrl(callbackUrl) {
    this.redirectService.url.next(callbackUrl);
  }

}
