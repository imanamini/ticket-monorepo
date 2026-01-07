import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditWallet } from '../../../api/purchase/credit-wallet.model';
import { PageDialogComponent } from '../../../credit-ui/page-dialog/page-dialog.component';
import { CreditApiService } from '../../../api/credit-api.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../../core/services/message.service';
import { CreditPayService } from '../../../shared/services/credit-pay.service';
import { Redirect } from '../../../api/purchase/redirect.model';
import { StorageService } from '../../../core/services/storage.service';
import { GetCreditDetailResponse } from '../../../api/purchase/get-credit-detail.response';
import {
  EditCreditAmountBottomSheetComponent
} from '../edit-credit-amount-bottom-sheet/edit-credit-amount-bottom-sheet.component';
import {
  DetailContent,
  FooterContent
} from '../../../shared/components/pay-details-information/pay-details-information.component';
import {
  CreditConfirmBottomSheetComponent,
  CreditConfirmBottomSheetData
} from '../../../credit-ui/credit-confirm-bottom-sheet/credit-confirm-bottom-sheet.component';
import { priceFormat } from '../../../../utils/strings';
import { ServiceType } from '../../../core/models/serviceType.model';
import { SignContractComponent } from './sign-contract/sign-contract.component';
import { TacService } from '../../services/tac.service';

@Component({
  selector: 'app-neo-pay-details',
  templateUrl: './neo-pay-details.component.html',
  styleUrls: ['../../shared.style.scss', './neo-pay-details.component.scss']
})
export class NeoPayDetailsComponent implements OnInit {

  fundProviderBusinessId: string;
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
  payType: 'card' | 'credit' = 'credit';
  creditId: string;

  footerDescription: string;
  footerActionTitle: string;
  payDetailContents: DetailContent[] = [];
  payDetailFooters: FooterContent[] = [];
  agreementRequired: boolean;
  agreementSigned: boolean;
  disableEditAmount: boolean;
  otpLoading: boolean;
  cellNumber: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private creditApiService: CreditApiService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private payService: CreditPayService,
    private storageService: StorageService,
    private bottomSheet: MatBottomSheet,
    private tacService: TacService,
  ) {
  }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.fundProviderBusinessId = params.fundProviderBusinessId;
    this.creditId = params.creditId ? params.creditId : undefined;
    this.payType = params.payType || 'credit';
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
    this.agreementSigned = false;
    this.gettingData = true;
    this.creditApiService.getCardWalletDetail(this.fundProviderBusinessId, amount, this.creditId).subscribe(response => {
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
    this.agreementRequired = response.creditAgreement;
    this.disableEditAmount = (
      response.serviceType === ServiceType.INSTALLMENT_SALE ||
      !response.creditDetail.amountEditable
    );
    this.cancelRedirect = response.cancelRedirect;
    this.cellNumber = response.cellNumber;
    this.maxAmount = Math.min(response.creditDetail.purchaseAmount - response.creditDetail.minimumCashPayAmount, response.creditDetail.withdrawalBalance);
    this.minAmount = response.creditDetail.minimumCreditAmount;
    this.maxAmountType = (response.creditDetail.withdrawalBalance <= response.creditDetail.purchaseAmount) ? 'balance' : 'purchase';
    this.historyData[response.creditDetail.creditAmount] = response;
    this.setTotalPayableCreditAmount();
    this.setTotalPayableAmount();
    if (this.totalPayableCreditAmount && this.creditWallet.payableAmount) {
      this.footerDescription = 'پرداخت نهایی در دو مرحله انجام می‌شود:';
    } else {
      this.footerDescription = 'پرداخت نهایی از اعتبار شما برداشت می‌شود:';
    }
    if (this.agreementRequired && !this.agreementSigned) {
      this.footerActionTitle = 'مشاهده قرارداد';
    } else {
      this.setFooterActionTitleOutOfAgreement();
    }
    this.makePayDetailContents(response.serviceType);
    this.makePayDetailFooters();
    this.gettingData = false;
    this.pageLoading = false;
  }

  setFooterActionTitleOutOfAgreement() {
    if (this.totalPayableCreditAmount && this.creditWallet.payableAmount) {
      this.footerActionTitle = 'پرداخت بخش نقدی';
    } else {
      this.footerActionTitle = 'ادامه و پرداخت';
    }
  }

  onBack() {
    const ticket = this.storageService.get('ticket');
    if (this.payType === 'card') {
      this.router.navigateByUrl(`card-pay/${ticket}`).then();
      return;
    }
    this.router.navigateByUrl(`ticket/${ticket}`);
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
    if (this.agreementRequired && !this.agreementSigned) {
      this.signContract();
    } else {
      this.confirmAfterSigned();
    }
  }

  confirmAfterSigned() {
    if (this.payType === 'card' && !this.disableEditAmount) {
      this.onConfirmCardPayType();
    } else {
      this.prepareAndGoToPurChase();
    }
  }

  signContract() {
    this.bottomSheet.open(SignContractComponent, {
      data: {
        creditId: this.creditWallet.creditId,
        creditAmount: this.creditWallet.creditAmount,
      },
      panelClass: ['digipay-bottom-sheet'],
      disableClose: true,
    }).afterDismissed().subscribe({
      next: response => {
        if (response.signed) {
          this.agreementSigned = true;
          this.setFooterActionTitleOutOfAgreement();
        }
        if (response.pay) {
          this.confirmAfterSigned();
        }
      }
    });
  }

  onConfirmCardPayType() {
    const convertedCredit = priceFormat(this.totalPayableCreditAmount);
    const description = `<div>مجموع پرداخت اعتباری ${convertedCredit} ریال است که این مبلغ <strong>نباید از اعتبار شما بیشتر</strong> باشد.</div>`;
    this.bottomSheet.open<CreditConfirmBottomSheetComponent, CreditConfirmBottomSheetData>(CreditConfirmBottomSheetComponent, {
      panelClass: ['digipay-bottom-sheet'],
      data: {
        rejectButtonTitle: 'ویرایش مبلغ',
        confirmButtonTitle: 'متوجه شدم',
        description
      }
    }).afterDismissed().subscribe(result => {
      if (result === true) {
        this.prepareAndGoToPurChase();
      } else if (result === false) {
        this.editAmount();
      }
    });
  }

  prepareAndGoToPurChase() {
    this.tacService.checkOtp(this.storageService.get('ticket'), this.cellNumber).subscribe({
      next: _ => {
        this.creditApiService.preparePurchase(
          this.creditWallet.fundProvider.businessId,
          this.creditWallet.creditId,
          this.creditWallet.creditAmount
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

  makePayDetailContents(serviceType: ServiceType) {
    const operationCostTitle: string = serviceType === ServiceType.INSTALLMENT_SALE ? 'ما به تفاوت خرید نقد و اقساط' : 'هزینه زیرساخت و خدمات';
    this.payDetailContents = [];
    let operationCostCashPortion: number = 0;
    let operationCostCreditPortion: number = 0;
    const operationCost = (this.creditWallet.prepaymentAmount || 0) + (this.creditWallet.feeCharge || 0) + (this.creditWallet.fpFeeCharge || 0);
    if (this.creditWallet.feeChargePayInCash) {
      operationCostCashPortion += operationCost;
    } else {
      operationCostCreditPortion += operationCost;
    }

    if (this.totalPayableCreditAmount) {
      const payDetailsContent: DetailContent = {
        footerTitle: 'مجموع پرداخت اعتباری ',
        footerAmount: this.totalPayableCreditAmount,
        rows: [
          {
            title: 'سهم پرداخت اعتباری',
            value: this.totalPayableCreditAmount - this.creditWallet.creditInterest - operationCostCreditPortion,
          },
          {
            title: 'سود اقساط',
            value: this.creditWallet.creditInterest,
            tooltip: 'این مبلغ باید از اعتبار شما پرداخت شود'
          },
          {
            title: operationCostTitle,
            value: operationCostCreditPortion,
            tooltip: 'این مبلغ باید از اعتبار شما پرداخت شود'
          }
        ],
      };

      this.payDetailContents.push(payDetailsContent);
    }

    if (this.creditWallet.payableAmount) {
      const payDetailsContent: DetailContent = {
        footerTitle: 'مجموع پرداخت نقدی',
        footerAmount: this.creditWallet.payableAmount,
        rows: [
          {
            title: 'سهم پرداخت نقدی',
            value: this.creditWallet.payableAmount - operationCostCashPortion,
          },
          {
            title: operationCostTitle,
            value: operationCostCashPortion,
            tooltip: 'این مبلغ باید از کارت بانکی پرداخت شود'
          }
        ]
      };

      this.payDetailContents.push(payDetailsContent);
    }
  }

  makePayDetailFooters() {
    this.payDetailFooters = [];

    if (this.creditWallet.payableAmount) {
      const payDetailsFooter: FooterContent = {
        icon: 'cash',
        title: 'بخش نقدی',
        amount: this.creditWallet.payableAmount
      };

      this.payDetailFooters.push(payDetailsFooter);
    }

    if (this.totalPayableCreditAmount) {
      const payDetailsFooter: FooterContent = {
        icon: 'credit',
        title: this.creditWallet.fundProvider.title,
        amount: this.totalPayableCreditAmount,
      };

      this.payDetailFooters.push(payDetailsFooter);
    }
  }
}
