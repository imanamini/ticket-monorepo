import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CardData } from '@digipay/ng-ui-payment-info-card';
import { ConfirmInternetPackageDialogData } from './models/confirm-internet-package-dialog-data';
import { ConfirmInternetPackageDialogResult } from './models/confirm-internet-package-dialog-result';
import { OPERATOR_IMAGE_IDS, OPERATOR_TRANSLATIONS } from '../../../../api/digipay/models/carrier/operator-ids';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormattedCellNumberPipe } from '@digipay/ng-lib-pipes';
import { UiPayButtonsComponent } from '../../../ui-components/ui-button/ui-pay-buttons/ui-pay-buttons.component';
import { UiPaymentCardComponent } from '../../../ui-components/ui-payment-card/ui-payment-card/ui-payment-card.component';
import { NgIf } from '@angular/common';
import { UiDialogBaseComponent } from '../../../ui-components/ui-dialogs/ui-dialog-base/ui-dialog-base.component';

@Component({
  selector: 'app-ui-internet-package-confirm',
  templateUrl: './ui-internet-package-confirm.component.html',
  styleUrls: ['./ui-internet-package-confirm.component.scss'],
  providers: [FormattedCellNumberPipe],
  standalone: true,
  imports: [UiDialogBaseComponent, NgIf, UiPaymentCardComponent, UiPayButtonsComponent],
})
export class UiInternetPackageConfirmComponent implements OnInit {
  cardData: CardData = null;

  walletBalanceIsSufficient = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmInternetPackageDialogData,
    private matDialogRef: MatDialogRef<UiInternetPackageConfirmComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData,
    private formattedCellNumber: FormattedCellNumberPipe,
  ) {}

  ngOnInit(): void {
    this.cardData = {
      title: 'بسته ' + OPERATOR_TRANSLATIONS[this.data.carrier],
      amount: this.data.internetPackage.amount,
      imageId: OPERATOR_IMAGE_IDS[this.data.carrier],
      colors: [15922680],
      details: [
        {
          label: 'مدت بسته',
          value: this.data.internetPackage.durationTranslation,
        },
        {
          label: 'شماره همراه',
          value: this.formattedCellNumber.transform(this.data.cellNumber),
        },
      ],
      description: {
        title: 'جزئیات بسته',
        items: [this.data.internetPackage.description],
      },
    };

    this.walletBalanceIsSufficient = this.data.internetPackage.amount <= this.data.walletBalance;
  }

  onReject(): void {
    this.matDialogRef.close(null);
  }

  onWalletPay(): void {
    this.matDialogRef.close({
      result: 'WALLET',
    } as ConfirmInternetPackageDialogResult);
  }

  onIpgPay(): void {
    this.matDialogRef.close({
      result: 'IPG',
    } as ConfirmInternetPackageDialogResult);
  }
}
