import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { CancelContractDialogComponent } from '../../../user-interface/dialogs/cancel-contract-dialog/cancel-contract-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletApiService } from '../../../api/wallet-api.service';
import { StorageService } from '../../../core/services/storage.service';
import { DirectDebitContract, DirectDebitTicketInfo, DirectDebitTicketInfoResponse } from '../../../api/models/direct-debit.response';
import * as moment from 'jalali-moment';
import { MessageService } from '../../../core/services/message.service';
import {
  DIRECT_DEBIT_BANKS,
  DIRECT_DEBIT_BANKS_IMAGE_ID,
  DIRECT_DEBIT_BANKS_TRANSLATE
} from '../../../api/constants/direct-debit.constants';
import { PERSISTENT_STORAGE_KEYS } from '../../../core/constants';
import { GA_DIRECT_DEBIT_ID } from '../../../api/constants/ga-direct-debit-id';
import { ActionTypeEnum } from '../../../api/emuns/direct-debit-ticket-info-action-type.enum';
import { HARVEST_DETAIL_SHARE_DATA } from '../../../user-interface/dialogs/create-contract-dialog/harvest-details-share-data-token';
import { BehaviorSubject } from 'rxjs';
import { HarvestDetailsShareData } from '../../../user-interface/dialogs/create-contract-dialog/harvest-details-share-data.model';
import { SubscriptionContractResponse } from '../../../api/models/subscription-contracts.response';
import { UiTemplateCardBase } from '../../../user-interface/components/ui-template-card/ui-template-card-base';

@Component({
  selector: 'app-direct-debit-management',
  templateUrl: './direct-debit-management.component.html',
  styleUrls: ['./direct-debit-management.component.scss']
})
export class DirectDebitManagementComponent extends UiTemplateCardBase implements OnInit {
  isLoading = false;

  tokenExpired = false;

  ticketInfo: DirectDebitTicketInfo;

  contractsResponse: Array<DirectDebitContract>;

  contracts = [];

  GA_DIRECT_DEBIT_HOME_ID = GA_DIRECT_DEBIT_ID.HOME;

  isPageLoaded = false;

  constructor(
    private router: Router,
    private overlay: Overlay,
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    private walletApi: WalletApiService,
    private storageService: StorageService,
    private messageService: MessageService,
    @Inject(HARVEST_DETAIL_SHARE_DATA) public harvestDetailsShareData: BehaviorSubject<HarvestDetailsShareData>,
  ) {
    super();
  }

  ngOnInit() {
    this.initialSetup();
  }

  initialSetup(): void {
    this.isPageLoaded = true;
    this.storageService.removePersistantItem(PERSISTENT_STORAGE_KEYS.CALLBACK_URL);
    this.storageService.removePersistantItem(PERSISTENT_STORAGE_KEYS.DIRECT_DEBIT);
    const ticket = this.getTicket();
    this.storageService.put({ticket});
    this.getTicketInfo();
  }

  getTicketInfo() {
    this.isLoading = true;
    this.walletApi.getDirectDebitTicketInfo(this.getTicket()).subscribe((response: DirectDebitTicketInfoResponse) => {
      this.setCallbackUrl(response.callbackUrl);
      this.ticketInfo = response.user;
      this.storageService.persistJSon(PERSISTENT_STORAGE_KEYS.DIRECT_DEBIT, this.ticketInfo);
      this.storageService.persistJSon(PERSISTENT_STORAGE_KEYS.DIRECT_DEBIT_TICKET_INFO, response);
      const actionType = (response.action && response.action.type) ? response.action.type : ActionTypeEnum.CASH_IN;
      this.getDirectDebits(actionType);
    }, (e) => {
      if (e.error && e.error.result) {
        this.messageService.showErrorIfExists(e);
      } else {
        this.messageService.showErrorMessage('بروز خطا، لطفا مجددا تلاش کنید');
      }
      this.isLoading = false;
    });
  }

  getDirectDebits(actionType = '0') {
    this.isLoading = true;
    this.contractsResponse = null;
    this.contracts = [];
    this.walletApi.getActiveDirectDebits(this.getTicket()).subscribe((response) => {
      this.contractsResponse = response.contracts;
      if (this.ticketInfo.nationalCode && this.contractsResponse && this.contractsResponse.length) {
        this.createData();
      } else {
        this.navigateToDirectDebit(actionType);
      }
    }, (e) => {
      if (e && e.status === 401) {
        this.tokenExpired = true;
        this.messageService.showErrorMessage('خطا در اعتبارسنجی');
        this.isLoading = false;
        setTimeout(() => {
          this.closeDirectDebit();
        }, 3000);
      }
    });
  }

  createData() {
    this.contractsResponse.forEach(item => {
      this.setCardTitle(item);
      this.setCardAmountPrefix(item);
      this.contracts.push({
        contractId: item.contractId,
        minWalletBalance: item.action.minWalletBalance,
        activationDate: this.getDate(item.activationDate),
        expirationDate: this.getDate(item.expirationDate),
        maxDailyTransactionAmount: item.maxDailyTransactionAmount,
        bankName: DIRECT_DEBIT_BANKS_TRANSLATE[DIRECT_DEBIT_BANKS[item.bankCode]],
        bankIcon: DIRECT_DEBIT_BANKS_IMAGE_ID[DIRECT_DEBIT_BANKS[item.bankCode]]
      });
    });
    this.isLoading = false;
  }

  cancelContract(contractData: Partial<SubscriptionContractResponse> = {}) {
    return this.matDialog.open(CancelContractDialogComponent, {
      width: '400px',
      maxWidth: '90%',
      maxHeight: '90vh',
      autoFocus: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: {
        id: {
          submit: GA_DIRECT_DEBIT_ID.HOME.CONFIRM_CONTRACT_CANCELLATION_CLICK,
          cancel: GA_DIRECT_DEBIT_ID.HOME.ABORT_CONTRACT_CANCELLATION_CLICK
        },
        contractInfo: {
          ...contractData,
          title: this.cardTitle,
        },
        cardAmountPrefix: this.cardAmountPrefix,
        confirmButtonTitle: this.contracts.length === 1 ? 'تایید و بازگشت' : 'تایید'
      }
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.doCancelContract(data.contractId);
      }
    });
  }

  doCancelContract(contractId) {
    this.isLoading = true;
    this.walletApi.cancelDirectDebitContract(contractId, this.getTicket()).subscribe((response) => {
      this.messageService.showMessage(response.result.message);
      setTimeout(() => {
        if (this.contracts.length <= 1) {
          this.closeDirectDebit();
        } else {
          // ToDo: Check it, is it ok without send action type?
          this.getDirectDebits();
        }
      }, 2000);
    }, (e) => {
      this.isLoading = false;
      if (e.error && e.error.result) {
        this.messageService.showErrorIfExists(e);
      } else {
        this.messageService.showErrorMessage('بروز خطا، لطفا مجددا تلاش کنید');
      }
    });
  }

  getDate(date) {
    return moment.from(date, 'fa').format('jYYYY-jMM-jDD');
  }

  setCallbackUrl(callbackUrl) {
    this.storageService.persist(PERSISTENT_STORAGE_KEYS.CALLBACK_URL, callbackUrl);
  }

  closeDirectDebit() {
    this.router.navigateByUrl('/direct-debit/callback').then();
  }

  /**
   * Get ticket from URL
   */
  getTicket() {
    return this.route.snapshot.paramMap.get('ticket');
  }

  goToDirectDebitContract(): void {
    const directDebitStorageData = this.storageService.getPersistantJsonItem(PERSISTENT_STORAGE_KEYS.DIRECT_DEBIT);
    this.storageService.persistJSon(PERSISTENT_STORAGE_KEYS.DIRECT_DEBIT, {...directDebitStorageData, hasActiveContract: true});
    const ticket = this.getTicket();
    this.router.navigate([`direct-debit/contract/${ticket}`]).then();
  }

  private navigateToDirectDebit(actionType = '0'): void {
    switch (actionType.toString()) {

      case ActionTypeEnum.DEFAULT:
        this.router.navigate(['/direct-debit/digiplus/' + this.getTicket()],
          {
            queryParams: {actionType}
          }).then();
        break;

      case ActionTypeEnum.CASH_IN:
      default:
        this.router.navigate(['/direct-debit/contract/' + this.getTicket()],
          {
            queryParams: {actionType}
          }).then();
        break;
    }
  }

  private setCardTitle(item: DirectDebitContract): void {
    switch (item.action.type.toString()) {
      case ActionTypeEnum.CASH_IN:
        this.cardTitle = 'شارژ خودکار کیف‌پول';
        break;
      case ActionTypeEnum.DEFAULT:
        this.cardTitle = 'قرارداد دیجی پلاس';
        break;
    }
  }

  private setCardAmountPrefix(item: DirectDebitContract): void {
    switch (item.action.type.toString()) {
      case ActionTypeEnum.CASH_IN:
        this.cardAmountPrefix = 'حداقل موجودی';
        break;
      case ActionTypeEnum.DEFAULT:
        this.cardAmountPrefix = undefined;
        break;
    }
  }
}
