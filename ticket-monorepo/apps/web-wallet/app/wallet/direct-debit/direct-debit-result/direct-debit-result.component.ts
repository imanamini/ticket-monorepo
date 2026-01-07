import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletApiService } from '../../../api/wallet-api.service';
import { RedirectService } from '../../../core/services/redirect.service';
import { DirectDebitContract, DirectDebitTicketInfo } from '../../../api/models/direct-debit.response';
import { MessageService } from '../../../core/services/message.service';
import * as moment from 'jalali-moment';
import {
  DIRECT_DEBIT_BANKS,
  DIRECT_DEBIT_BANKS_IMAGE_ID,
  DIRECT_DEBIT_BANKS_TRANSLATE
} from '../../../api/constants/direct-debit.constants';
import { PERSISTENT_STORAGE_KEYS } from '../../../core/constants';
import { StorageService } from '../../../core/services/storage.service';
import { GA_DIRECT_DEBIT_ID } from '../../../api/constants/ga-direct-debit-id';
import { ActionTypeEnum } from '../../../api/emuns/direct-debit-ticket-info-action-type.enum';
import { NavigateService } from '../../../api/services/navigate.service';
import { DirectDebitCardModel } from './models/direct-debit-card.model';
import { DirectDebitResultDataInterface } from './interfaces/direct-debit-result-data.interface';

@Component({
  selector: 'app-direct-debit-result',
  templateUrl: './direct-debit-result.component.html',
  styleUrls: ['./direct-debit-result.component.scss']
})
export class DirectDebitResultComponent implements OnInit {

  isLoading = false;

  ticketInfo: DirectDebitTicketInfo;

  contractInfo: DirectDebitContract;

  tokenExpired = false;

  contract;

  resultData: DirectDebitResultDataInterface;

  card = new DirectDebitCardModel().card;

  ActionTypeEnum = ActionTypeEnum;

  GA_DIRECT_DEBIT_ID_CONTRACT = GA_DIRECT_DEBIT_ID.CONTRACT;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public navigateService: NavigateService,
    private walletApi: WalletApiService,
    private messageService: MessageService,
    private storageService: StorageService,
    private redirectService: RedirectService
  ) {
  }

  ngOnInit() {
    this.resultData = JSON.parse(decodeURIComponent(escape(window.atob(this.route.snapshot.queryParams['data']))));
    this.setCardConfig(this.resultData.action.type);
    if (this.resultData && this.resultData.result) {
      if (this.resultData.result.status === 9208) {
        this.messageService.showErrorMessage(this.resultData.result.message || 'خطا در پردازش اطلاعات');
        setTimeout(() => {
          this.router.navigateByUrl('/direct-debit/callback').then();
        }, 3000);
      } else if (this.resultData.result.status !== 0) {
        this.redirectToContracts();
      }
    }
    this.getTicketInfo();
  }

  getTicketInfo() {
    this.isLoading = true;
    this.walletApi.getDirectDebitTicketInfo(this.resultData.ticket).subscribe((response) => {
      this.setCallbackUrl(response.callbackUrl);
      this.ticketInfo = response.user;
      this.storageService.persistJSon(PERSISTENT_STORAGE_KEYS.DIRECT_DEBIT, this.ticketInfo);
      this.getContractInfo();
    }, (e) => {
      if (e && e.status === 401) {
        this.tokenExpired = true;
        this.messageService.showErrorMessage('خطا در اعتبارسنجی');
        setTimeout(() => {
          this.navigateService.toCallback();
        }, 3000);
      }
      this.isLoading = false;
    });
  }

  getContractInfo() {
    this.walletApi.getDirectDebitContractInfo(this.resultData.contractId, this.resultData.ticket).subscribe((response) => {
      this.contractInfo = response.contract;
      this.createData();
    }, (e) => {
      if (e.error && e.error.result) {
        this.messageService.showErrorIfExists(e);
      } else {
        this.messageService.showErrorMessage('بروز خطا، لطفا مجددا تلاش کنید');
      }
    });
  }

  createData() {
    this.isLoading = false;
    this.contract = {
      contractId: this.contractInfo.contractId,
      minWalletBalance: this.contractInfo.action.minWalletBalance,
      activationDate: this.getDate(this.contractInfo.activationDate),
      expirationDate: this.getDate(this.contractInfo.expirationDate),
      maxDailyTransactionAmount: this.contractInfo.maxDailyTransactionAmount,
      bankName: DIRECT_DEBIT_BANKS_TRANSLATE[DIRECT_DEBIT_BANKS[this.contractInfo.bankCode]],
      bankIcon: DIRECT_DEBIT_BANKS_IMAGE_ID[DIRECT_DEBIT_BANKS[this.contractInfo.bankCode]]
    };
  }

  getDate(date) {
    return moment.from(date, 'fa').format('jYYYY-jMM-jDD');
  }

  redirectToContracts() {
    this.router.navigateByUrl('/direct-debit/management/' + this.resultData.ticket, {});
  }

  setCallbackUrl(callbackUrl) {
    this.redirectService.url.next(callbackUrl);
  }

  private setCardConfig(actionType: ActionTypeEnum): void {
    switch (actionType.toString()) {

      case ActionTypeEnum.CASH_IN:
        this.card = {
          title: 'شارژ خودکار کیف‌پول',
          iconPath: '/assets/checked.svg',
          description: {
            text: 'شارژ خودکار کیف‌پول شما فعال شد',
            style: {
              color: '#00cc6d',
              'font-size': '18px'
            }
          }
        };
        break;

      case ActionTypeEnum.DEFAULT:
        this.card = {
          title: 'پرداخت اتوماتیک',
          iconPath: '/assets/checkmark-square.svg',
          description: {
            text: 'سرویس پرداخت خودکار اشتراک ماهیانه دیجی‌پلاس فعال شد',
            style: {
              color: '#2c3544',
              'font-size': '14px'
            }
          }
        };
        break;

    }
  }
}
