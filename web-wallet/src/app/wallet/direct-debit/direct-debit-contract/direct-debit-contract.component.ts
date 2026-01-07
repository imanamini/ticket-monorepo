import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { CreateContractDialogComponent } from '../../../user-interface/dialogs/create-contract-dialog/create-contract-dialog.component';
import { WalletApiService } from '../../../api/wallet-api.service';
import { DirectDebitBank, DirectDebitContract, DirectDebitTicketInfo } from '../../../api/models/direct-debit.response';
import { ActivatedRoute, Router } from '@angular/router';
import { OtpPinDialogComponent } from '../../../user-interface/dialogs/otp-pin-dialog/otp-pin-dialog.component';
import { TacResponse } from '../../../api/models/tac.response';
import { MessageService } from '../../../core/services/message.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { PERSISTENT_STORAGE_KEYS } from '../../../core/constants';
import { GA_DIRECT_DEBIT_ID } from '../../../api/constants/ga-direct-debit-id';
import { invalidNationalCode } from './national-code-validation';
import { ActionTypeEnum } from '../../../api/emuns/direct-debit-ticket-info-action-type.enum';
import { DirectDebitNavigationService } from '../withdrawal-details-digiplus/services/direct-debit-navigation.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-direct-debit-contract',
  templateUrl: './direct-debit-contract.component.html',
  styleUrls: ['./direct-debit-contract.component.scss']
})
export class DirectDebitContractComponent implements OnInit, OnDestroy {
  GA_DIRECT_DEBIT_HOME = GA_DIRECT_DEBIT_ID.HOME;

  isLoading = false;

  activationButtonLoading = false;

  tacResponse: TacResponse;

  tokenExpired = false;

  nationalCode = '';

  userVerified = false;

  ticketInfo: DirectDebitTicketInfo;

  banksResponse: Array<DirectDebitBank>;

  requestData = {};

  form: FormGroup;

  formFields = {
    nationalCode: '',
    customTicket: ''
  };

  retryCountInit = 3;

  retryCount: number;

  constructor(
    private router: Router,
    private overlay: Overlay,
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    private storage: StorageService,
    private walletApi: WalletApiService,
    private messageService: MessageService,
    private directDebitNavigationService: DirectDebitNavigationService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  contractsResponse: Array<DirectDebitContract>;

  @HostListener('window:popstate', [])
  onPopState() {
    if (this.contractsResponse.length) {
      return;
    }
    this.locationBack();
  }

  ngOnInit() {
    this.retryCount = this.retryCountInit;
    this.createForm();
    this.getTac();
    this.getActiveContracts();
  }

  getActiveContracts(): void {
    this.walletApi.getActiveDirectDebits(this.getTicket()).subscribe((response) => {
      this.contractsResponse = response.contracts;
    });
  }

  ngOnDestroy(): void {
    let directDebitStorageData = this.storage.getPersistantJsonItem(PERSISTENT_STORAGE_KEYS.DIRECT_DEBIT);
    directDebitStorageData = directDebitStorageData.hasActiveContract && (delete directDebitStorageData.hasActiveContract);
    this.storage.persistJSon(PERSISTENT_STORAGE_KEYS.DIRECT_DEBIT, {directDebitStorageData});
  }

  createForm() {
    this.form = new FormGroup({
      nationalCode: new FormControl(this.formFields.nationalCode, [
        Validators.required,
        invalidNationalCode
      ]),
      customTicket: new FormControl(this.formFields.customTicket)
    });
  }

  getTac() {
    if (this.retryCount > 0) {
      this.retryCount--;
      this.isLoading = true;
      this.walletApi.inAppTac(this.getTicket()).subscribe(tacResponse => {
        this.tacResponse = tacResponse;
        this.tokenExpired = false;
        this.isLoading = false;
        this.retryCount = this.retryCountInit;
        this.initiateContract();
      }, (e) => {
        if (e && e.status === 403) {
          this.tokenExpired = true;
          this.messageService.showErrorMessage('خطا در اعتبارسنجی');
          setTimeout(() => {
            this.closeDirectDebit();
            this.router.navigateByUrl('/direct-debit/callback').then();
          }, 3000);
        } else {
          this.getTac();
        }
        this.isLoading = false;
      });
    } else {
      this.router.navigateByUrl('/direct-debit/callback').then();
    }
  }

  initiateContract() {
    const ticket = this.getTicket();
    this.storage.put({
      ticket
    });
    this.ticketInfo = this.storage.getPersistantJsonItem(PERSISTENT_STORAGE_KEYS.DIRECT_DEBIT);
    this.hasActiveContract();
  }

  createContractDialog() {
    if (this.retryCount > 0) {
      this.retryCount--;
      this.activationButtonLoading = true;
      this.walletApi.getDirectDebitBanks(this.getTicket()).subscribe((response) => {
        this.banksResponse = response.banks;
        this.isLoading = false;
        this.activationButtonLoading = false;
        return this.matDialog.open(CreateContractDialogComponent, {
          width: '412px',
          maxWidth: '90%',
          maxHeight: '90vh',
          autoFocus: false,
          disableClose: !!(this.ticketInfo && this.ticketInfo.nationalCode),
          scrollStrategy: this.overlay.scrollStrategies.noop(),
          data: {
            id: {
              bank: GA_DIRECT_DEBIT_ID.CONTRACT.SELECT_BANK_CLICK,
              submit: GA_DIRECT_DEBIT_ID.CONTRACT.CONTINUE_AFTER_SELECTING_BANK_CLICK,
              cancel: GA_DIRECT_DEBIT_ID.CONTRACT.CANCEL_BANK_SELECTION_CLICK
            },
            banks: this.banksResponse,
            nationalCode: this.nationalCode,
            ticket: this.getTicket(),
            submitted: !!(this.ticketInfo && this.ticketInfo.nationalCode)
          }
        }).afterClosed().subscribe((data) => {
          if (data) {
            if (!data.nationalCode) {
              data.nationalCode = this.formFields.nationalCode;
            }
            this.requestData = data;
            if (this.ticketInfo && this.ticketInfo.verified) {
              this.registerContract(this.requestData);
            } else {
              this.openOtpDialog('OTP');
            }
          }
        });
      }, (e) => {
        if (e && e.status === 401) {
          this.tokenExpired = true;
          this.messageService.showErrorMessage('خطا در اعتبارسنجی');
          setTimeout(() => {
            this.closeDirectDebit();
          }, 3000);
        } else {
          this.createContractDialog();
        }
        this.isLoading = false;
      });
    } else {
      this.router.navigateByUrl('/direct-debit/callback').then();
    }
  }

  openOtpDialog(protection: 'PIN' | 'OTP') {
    return this.matDialog.open(OtpPinDialogComponent, {
      width: '400px',
      maxWidth: '90%',
      maxHeight: '90vh',
      autoFocus: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: {
        amount: null,
        walletBalance: null,
        userDetail: this.tacResponse.userDetail,
        protection,
        features: [250]
      }
    }).afterClosed().subscribe((data) => {
      if (data.verified) {
        this.registerContract(this.requestData);
      }
    });
  }

  registerContract(body) {
    this.isLoading = true;
    const ticket: string = this.formFields.customTicket ? this.formFields.customTicket : this.getTicket();
    this.walletApi.registerDirectDebitContract(body, ticket).subscribe((response) => {
      window.location.replace(response.redirectUrl);
    }, (e) => {
      this.isLoading = false;
      if (e.error && e.error.result) {
        this.messageService.showErrorIfExists(e);
      } else {
        this.messageService.showErrorMessage('بروز خطا، لطفا مجددا تلاش کنید');
      }
      if (this.ticketInfo.nationalCode) {
        this.userVerified = true;
        this.nationalCode = this.ticketInfo.nationalCode;
        this.createContractDialog();
      }
    });
  }

  handleCloseAction() {
    if (this.ticketInfo && this.ticketInfo.nationalCode) {
      this.router.navigateByUrl('/direct-debit/management/' + this.getTicket()).then();
    } else {
      this.closeDirectDebit();
    }
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

  locationBack(): void {
    const actionType: ActionTypeEnum =
      this.storage.getPersistantJsonItem(PERSISTENT_STORAGE_KEYS.DIRECT_DEBIT_TICKET_INFO).action.type.toString();

    if (actionType === ActionTypeEnum.CASH_IN) {
      this.router.navigateByUrl('/direct-debit/callback').then();
      return;
    }
    const ticket: string = this.directDebitNavigationService.getParam(this.activatedRoute, 'ticket');
    this.directDebitNavigationService.navigateToDigiplusPage(ticket);
  }

  scrollToActivationButton(): void {
    setTimeout(() => {
      document.getElementById('direct-debit-activation-button').scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    }, 300);
  }

  private hasActiveContract() {
    const directDebitStorageData = this.storage.getPersistantJsonItem(PERSISTENT_STORAGE_KEYS.DIRECT_DEBIT);
    if (directDebitStorageData.hasActiveContract) {
      this.userVerified = true;
      this.nationalCode = this.ticketInfo.nationalCode;
      this.createContractDialog();
    }
  }
}
