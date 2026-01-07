import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { WalletApiService } from '../../../api/wallet-api.service';
import { StorageService } from '../../../core/services/storage.service';
import { MessageService } from '../../../core/services/message.service';
import { OtpPinDialogComponent } from '../otp-pin-dialog/otp-pin-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DirectDebitBank, DirectDebitTicketInfoResponse } from '../../../api/models/direct-debit.response';
import { GA_DIRECT_DEBIT_ID } from '../../../api/constants/ga-direct-debit-id';
import { AnalyticsId } from '../../../api/models/analytics-id';
import { HARVEST_DETAIL_SHARE_DATA } from './harvest-details-share-data-token';
import { BehaviorSubject } from 'rxjs';
import { HarvestDetailsShareData } from './harvest-details-share-data.model';
import { CreateContractRequestData } from './create-contract-request-data.model';
import {
  DirectDebitNavigationService
} from '../../../wallet/direct-debit/withdrawal-details-digiplus/services/direct-debit-navigation.service';
import { ActionTypeEnum } from '../../../api/emuns/direct-debit-ticket-info-action-type.enum';
import { PERSISTENT_STORAGE_KEYS } from '../../../core/constants';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

enum CONTRACT_STEP {
  'SELECT_BANK' = 1,
  'HARVEST_DETAIL' = 2
}

enum MODAL_TITLE {
  'SELECT_BANK' = 'انتخاب بانک صادر کننده',
  'HARVEST_DETAIL' = 'جزییات برداشت'
}

@Component({
  selector: 'app-create-contract-dialog',
  templateUrl: './create-contract-dialog.component.html',
  styleUrls: ['./create-contract-dialog.component.scss']
})

export class CreateContractDialogComponent {
  GA_DIRECT_DEBIT_CONTRACT_ID = GA_DIRECT_DEBIT_ID.CONTRACT;
  selectedBank: DirectDebitBank;
  initStep = 1;
  currentStep: string = CONTRACT_STEP[this.initStep];
  modalTitle: string = MODAL_TITLE.SELECT_BANK;

  constructor(
    @Inject(HARVEST_DETAIL_SHARE_DATA) public harvestDetailsShareData: BehaviorSubject<HarvestDetailsShareData>,
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      id?: AnalyticsId,
      banks: Array<DirectDebitBank>,
      nationalCode: string,
      ticket: string,
      submitted: boolean
    },
    private router: Router,
    private ms: MessageService,
    private route: ActivatedRoute,
    private storage: StorageService,
    private walletApi: WalletApiService,
    private matDialogRef: MatDialogRef<OtpPinDialogComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    private navigateService: DirectDebitNavigationService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  confirm() {
    switch (this.currentStep) {
      case 'SELECT_BANK':
        const actionType: string = this.navigateService.getQueryParam(this.activatedRoute, 'actionType');
        if (actionType === ActionTypeEnum.DEFAULT) {
          this.finalOperation();
          return;
        }
        this.operationOfHarvestDetailStep();
        this.setStepTwoFooterId();
        break;
      case 'HARVEST_DETAIL':
        this.finalOperation();
        break;
      default:
        break;
    }
  }

  private operationOfHarvestDetailStep(): void {
    this.currentStep = CONTRACT_STEP[this.initStep + 1];
    this.modalTitle = MODAL_TITLE.HARVEST_DETAIL;
    this.changeDetectorRef.detectChanges();
  }

  private finalOperation(): void {
    const requestData: CreateContractRequestData = this.fillRequestData();
    this.matDialogRef.close(requestData);
  }

  private fillRequestData(): CreateContractRequestData {
    const ticketInfo: DirectDebitTicketInfoResponse = this.storage.getPersistantJsonItem(PERSISTENT_STORAGE_KEYS.DIRECT_DEBIT_TICKET_INFO);

    const harvestHasDuration = this.harvestDetailsShareData.value &&
      this.harvestDetailsShareData.value.duration &&
      this.harvestDetailsShareData.value.duration.timeUnit;
    const ticketInfoHasDuration = ticketInfo && ticketInfo.duration && ticketInfo.duration.timeUnit;

    const harvestHasCount = this.harvestDetailsShareData.value
      && this.harvestDetailsShareData.value.duration
      && this.harvestDetailsShareData.value.duration.count;
    const ticketInfoHasCount = ticketInfo && ticketInfo.duration && ticketInfo.duration.count;

    const harvestHasActionType = this.harvestDetailsShareData.value
      && this.harvestDetailsShareData.value.action
      && this.harvestDetailsShareData.value.action.type;
    const ticketInfoHasActionType = ticketInfo && ticketInfo.action && ticketInfo.action.type;

    const harvestHasMaxDailyTransactionAmount = this.harvestDetailsShareData.value
      && this.harvestDetailsShareData.value.maxDailyTransactionAmount !== 0;

    const harvestHasMinWalletBalance = this.harvestDetailsShareData.value
      && this.harvestDetailsShareData.value.minWalletBalance !== 0;

    return {
      ticket: this.dialogData.ticket,
      bankCode: this.selectedBank.code,
      nationalCode: this.dialogData.nationalCode,
      maxDailyTransactionAmount: harvestHasMaxDailyTransactionAmount ?
        this.harvestDetailsShareData.value.maxDailyTransactionAmount : ticketInfo.maxDailyTransactionAmount,

      action: {
        type: ActionTypeEnum.CASH_IN,
        ...(harvestHasActionType &&
          {type: this.harvestDetailsShareData.value.action.type}),
        ...(ticketInfoHasActionType &&
          {type: ticketInfo.action.type}),

        ...(harvestHasMinWalletBalance &&
          {minWalletBalance: this.harvestDetailsShareData.value.minWalletBalance}),
      },

      duration: {
        ...(harvestHasCount &&
          {count: this.harvestDetailsShareData.value.duration.count}),

        ...(ticketInfoHasCount &&
          {count: ticketInfo.duration.count}),

        ...(harvestHasDuration &&
          {timeUnit: this.harvestDetailsShareData.value.duration.timeUnit}),

        ...(ticketInfoHasDuration &&
          {timeUnit: ticketInfo.duration.timeUnit}),
      }
    };
  }

  private setStepTwoFooterId() {
    this.dialogData.id = {
      ...this.dialogData.id,
      cancel: this.GA_DIRECT_DEBIT_CONTRACT_ID.CANCEL_CONTRACT_CREATION,
      submit: this.GA_DIRECT_DEBIT_CONTRACT_ID.CONTINUE_CONTRACT_CREATION_CLICK,
    };
  }

  cancel(): void {
    switch (this.currentStep) {
      case 'HARVEST_DETAIL':
        this.backToBankStep();
        break;
      case 'SELECT_BANK':
        this.matDialogRef.close(false);
        this.navigateToDirectDebit();
        break;
      default:
        this.matDialogRef.close(false);
        break;
    }
  }

  private navigateToDirectDebit(): void {
    this.router.navigateByUrl('/direct-debit/management/' + this.dialogData.ticket).then(() => {
      this.matDialogRef.close(false);
    });
  }

  private backToBankStep(): void {
    this.bankStepConfig();
    this.currentStep = CONTRACT_STEP[this.initStep];
  }

  private bankStepConfig(): void {
    this.modalTitle = MODAL_TITLE.SELECT_BANK;
  }
}
