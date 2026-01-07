import { Component, OnInit } from '@angular/core';
import { DirectDebitBank, DirectDebitContractRegister, DirectDebitTicketInfoResponse } from '../../../api/models/direct-debit.response';
import { WalletApiService } from '../../../api/wallet-api.service';
import { ActivatedRoute } from '@angular/router';
import { DirectDebitNavigationService } from '../services/direct-debit-navigation.service';
import { ApiResult } from '../../../api/models/api-result';
import { MessageService } from '../../../core/services/message.service';
import { LocationStrategy } from '@angular/common';
import { CreateContractRequestData } from '../../../user-interface/dialogs/create-contract-dialog/create-contract-request-data.model';
import { HandleErrorService } from '../services/handle-error.service';
import { RedirectFormData } from '../../../core/services/redirect.service';
import { RedirectDataFactory } from '../utiles/redirect-form-data';
import { StorageService } from '../../../core/services/storage.service';
import { TicketService } from '../services/ticket.service';
import { TicketInfoService } from '../services/ticket-info.service';

@Component({
  selector: 'app-backup-account',
  templateUrl: './backup-account.component.html',
  styleUrls: ['./backup-account.component.scss'],
  providers: [TicketInfoService, TicketService, DirectDebitNavigationService]
})

export class BackupAccountComponent implements OnInit {
  selectedBank: DirectDebitBank;
  isLoading = false;
  defaultDailyAmountMax = 2000000;
  ticketInfo: DirectDebitTicketInfoResponse;
  bankList: Array<DirectDebitBank>;

  constructor(
    private storageService: StorageService,
    private walletApiService: WalletApiService,
    private activatedRoute: ActivatedRoute,
    private directDebitNavigationService: DirectDebitNavigationService,
    private messageService: MessageService,
    private handleErrorService: HandleErrorService,
    private location: LocationStrategy,
    private ticketService: TicketService,
    private ticketInfoService: TicketInfoService
  ) {
  }

  ngOnInit(): void {
    this.getTicketInfo().then();
    this.getBankList();
  }

  public selectBank(bankItem): void {
    this.selectedBank = bankItem;
  }

  public cancel(): void {
    const redirectFormData: RedirectFormData[] = new RedirectDataFactory()
      .cancelByUserFormData(this.ticketInfo.providerId);
    this.directDebitNavigationService.navigateToMerchant(redirectFormData).then();
  }

  public async back(): Promise<void> {
    const nationalCode = this.activatedRoute.snapshot.queryParams['nationalCode'];
    this.directDebitNavigationService.navigateToWithdrawal('nationalCode', nationalCode);
  }

  public unAuthorizedRedirectFormData(): void {
    const redirectFormData: RedirectFormData[] = new RedirectDataFactory()
      .unknownFormData(this.ticketInfo.providerId);
    this.directDebitNavigationService.navigateToMerchant(redirectFormData).then();
  }

  public callRegisterApi() {
    const ticket = this.ticketService.get();
    this.isLoading = true;
    const body: CreateContractRequestData = {
      ticket: ticket.toString(),
      maxDailyTransactionAmount: this.ticketInfo.maxDailyTransactionAmount,
      bankCode: this.selectedBank.code,
      nationalCode: this.activatedRoute.snapshot.queryParams['nationalCode'],
      action: {
        type: this.ticketInfo.action.type,
      },
      duration: {
        timeUnit: this.ticketInfo.duration.timeUnit,
        count: this.ticketInfo.duration.count
      }
    };
    this.walletApiService.registerDirectDebitContract(body, ticket)
      .subscribe((response: DirectDebitContractRegister) => {
        window.location.replace(response.redirectUrl);
        this.isLoading = false;
      }, (errorResponse: ApiResult) => {
        this.handleErrorService.handle(errorResponse);
        this.isLoading = false;
      });
  }

  private async getTicketInfo(): Promise<void> {
    try {
      this.ticketInfo = await this.ticketInfoService.get();
    } catch (error) {
      this.ticketInfo = null;
    }
  }

  private getBankList(): void {
    const ticket = this.ticketService.get();
    this.walletApiService.getDirectDebitBanks(ticket)
      .subscribe((response) => {
        this.bankList = response.banks;
      }, (errorResponse: ApiResult) => {
        this.handleErrorService.handle(errorResponse);
      });
  }
}
