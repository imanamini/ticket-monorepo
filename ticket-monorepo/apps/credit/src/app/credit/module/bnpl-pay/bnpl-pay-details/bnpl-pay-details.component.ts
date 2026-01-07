import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditWallet, DisabledWalletMessage, InstallmentPreview } from '../../../api/purchase/credit-wallet.model';
import { PageDialogComponent } from '../../../credit-ui/page-dialog/page-dialog.component';
import { CreditApiService } from '../../../api/credit-api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MessageService } from '../../../core/services/message.service';
import { CreditPayService } from '../../../shared/services/credit-pay.service';
import { Redirect } from '../../../api/purchase/redirect.model';
import { StorageService } from '../../../core/services/storage.service';
import { GetCreditDetailResponse, RepaymentOption } from '../../../api/purchase/get-credit-detail.response';
import {
  EditCreditAmountBottomSheetComponent
} from '../../pay/edit-credit-amount-bottom-sheet/edit-credit-amount-bottom-sheet.component';
import { CancelService } from '../../../shared/services/cancel.service';
import { TacService } from '../../services/tac.service';

@Component({
  selector: 'app-bnpl-pay-details',
  templateUrl: './bnpl-pay-details.component.html',
  styleUrls: ['../../shared.style.scss', './bnpl-pay-details.component.scss']
})
export class BnplPayDetailsComponent implements OnInit {

  xPay = signal<boolean>(false);
  installmentsPreview = signal<InstallmentPreview[]>(null);
  cashFee = signal<number>(0);
  creditFee = signal<number>(0); // Doesn't contain installment fee

  fundProviderBusinessId: string;
  creditId: string;
  couponCode: string;
  gettingData: boolean;
  creditWallet: CreditWallet;
  isConfirmedContract: boolean;
  gettingContract: boolean;
  amount: number;
  cancelRedirect: Redirect;
  minAmount: number;
  maxAmount: number;
  maxAmountType: 'balance' | 'purchase';
  amountIsValid = true;
  historyData: { [key: number]: GetCreditDetailResponse } = {};
  totalPayableCreditAmount: number;
  pageLoading: boolean;
  totalPayableAmount: number;

  otpLoading: boolean;
  cellNumber: string;
  disableEditAmount = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private creditApiService: CreditApiService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private payService: CreditPayService,
    private storageService: StorageService,
    private cancelService: CancelService,
    private bottomSheet: MatBottomSheet,
    private tacService: TacService,
  ) {
  }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.fundProviderBusinessId = params.fundProviderBusinessId;
    this.creditId = params.creditId;
    this.couponCode = params.couponCode;
    this.storageService.set({ticket: params.ticket});
    this.tacService.otpLoading.subscribe(r => this.otpLoading = r);
    this.getData();
  }

  getData(amount: number = null) {
    if (amount && this.historyData[amount]) {
      this.setData(this.historyData[amount]);
      return;
    }
    if (!amount) {
      this.pageLoading = true;
    }
    this.gettingData = true;
    this.creditApiService.getCardWalletDetail(this.fundProviderBusinessId, amount, this.creditId, this.couponCode).subscribe(response => {
      this.setData(response);
      if (!amount) {
        this.amount = response.creditDetail.creditAmount;
      }
    }, error => {
      this.payService.goToErrorPageByErrorResponse(error);
    });
  }

  setData(response: GetCreditDetailResponse): void {
    this.creditWallet = response.creditDetail;
    this.cancelRedirect = response.cancelRedirect;
    this.cellNumber = response.cellNumber;
    this.xPay.set(response.repaymentOption === RepaymentOption.PAY_IN_X);
    this.installmentsPreview.set(response.creditDetail.installmentPreviews);
    this.handleDisable(response.creditDetail.disable, response.creditDetail.messages);
    this.maxAmount = Math.min(
      response.creditDetail.purchaseAmount - response.creditDetail.minimumCashPayAmount,
      response.creditDetail.withdrawalBalance
    );
    this.minAmount = response.creditDetail.minimumCreditAmount;
    this.maxAmountType = (response.creditDetail.withdrawalBalance <= response.creditDetail.purchaseAmount) ? 'balance' : 'purchase';
    this.historyData[response.creditDetail.creditAmount] = response;
    this.setCashFee();
    this.setCreditFee();
    this.setTotalPayableCreditAmount();
    this.setTotalPayableAmount();
    if (this.checkOneShot(response)) {
      return this.onConfirm();
    }
    this.gettingData = false;
    this.pageLoading = false;
  }

  checkOneShot(response: GetCreditDetailResponse): boolean {
    return (
      !response.creditDetail.disable &&
      response.repaymentOption === RepaymentOption.PAY_IN_ONE &&
      response.creditDetail.payableAmount === 0
    );
  }

  handleDisable(disable: boolean, messages: DisabledWalletMessage[]) {
    if (disable) {
      const message: string = messages.reduce((prev, current) => {
        prev = prev + current.text + '. ';
        return prev;
      }, '');
      this.messageService.showErrorMessage(message);
    }
  }

  setCashFee() {
    let temp = 0;
    if (this.creditWallet.feeChargePayInCash) {
      temp += this.creditWallet.feeCharge;
    }
    if (this.creditWallet.fpFeeChargePayInCash) {
      temp += this.creditWallet.fpFeeCharge;
    }
    if (temp) {
      this.cashFee.set(temp);
    }
  }

  setCreditFee() {
    let temp = this.creditWallet.creditInterest;
    if (!this.creditWallet.feeChargePayInCash) {
      temp += this.creditWallet.feeCharge;
    }
    if (!this.creditWallet.fpFeeChargePayInCash) {
      temp += this.creditWallet.fpFeeCharge;
    }
    if (temp) {
      this.creditFee.set(temp);
    }
  }

  onBack() {
    this.cancelService.confirmBottomSheet();
  }

  setTotalPayableCreditAmount() {
    this.totalPayableCreditAmount = this.creditWallet.creditAmount + this.creditWallet.creditInterest;
    if (!this.creditWallet.feeChargePayInCash && this.creditWallet.feeCharge) {
      this.totalPayableCreditAmount += this.creditWallet.feeCharge;
    }
    if (!this.creditWallet.fpFeeChargePayInCash && this.creditWallet.fpFeeCharge) {
      this.totalPayableCreditAmount += this.creditWallet.fpFeeCharge;
    }
  }

  setTotalPayableAmount() {
    this.totalPayableAmount = this.creditWallet.purchaseAmount + this.creditWallet.creditInterest;
    if (this.creditWallet.feeCharge) {
      this.totalPayableAmount += this.creditWallet.feeCharge;
    }
    if (this.creditWallet.fpFeeCharge) {
      this.totalPayableAmount += this.creditWallet.fpFeeCharge;
    }
    if (this.creditWallet.prepaymentAmount) {
      this.totalPayableAmount += this.creditWallet.prepaymentAmount;
    }
  }

  onConfirm() {
    this.tacService.checkOtp(this.storageService.get('ticket'), this.cellNumber).subscribe({
      next: _ => {
        this.pageLoading = true;
        this.creditApiService.preparePurchase(
          this.creditWallet.fundProvider.businessId,
          this.creditWallet.creditId,
          this.creditWallet.creditAmount,
          this.couponCode,
        ).subscribe(() => {
          this.router.navigateByUrl(`purchase/${this.storageService.get('ticket')}`);
        }, error => {
          this.payService.goToErrorPageByErrorResponse(error);
        });
      },
      error: e => {
        this.payService.goToErrorPage(e);
      }
    });
  }

  showContract() {
    if (this.gettingContract) {
      return;
    }
    this.gettingContract = true;
    this.creditApiService.getContract(
      this.creditWallet.totalAmount,
      this.creditWallet.creditAmount,
      this.creditWallet.fundProvider.fundProviderCode,
      this.creditWallet.creditId
    )
      .subscribe(r => {
        this.gettingContract = false;
        this.dialog.open(PageDialogComponent, {
          panelClass: ['page-dialog-component'],
          data: {
            title: 'قرارداد فروش اقساطی',
            html: r || '',
          }
        });
      }, e => {
        this.gettingContract = false;
        if (e && e.result) {
          this.messageService.showErrorMessage(e.result.message);
          return;
        }
        if (e && e.httpStatus === 401) {
          this.payService.goToExpiredTokenPage();
        }
        this.messageService.showErrorMessage('بروز خطا در دریافت اطلاعات قرارداد');
      });
  }

  amountValueChanged(amount: number) {
    this.amount = amount;
    this.amountIsValid = (this.amount >= this.minAmount && this.amount <= this.maxAmount);
    if (this.amountIsValid) {
      this.getData(this.amount);
    }
  }

  editAmount() {
    this.bottomSheet.open(EditCreditAmountBottomSheetComponent, {
      panelClass: ['digipay-bottom-sheet'],
      data: {
        creditAmount: this.amount,
        minAmount: this.minAmount,
        maxAmount: this.maxAmount,
        maxAmountType: this.maxAmountType,
      }
    }).afterDismissed().subscribe(result => {
      if (result && result.confirmed) {
        this.amountValueChanged(result.creditAmount);
      }
    });
  }
}
