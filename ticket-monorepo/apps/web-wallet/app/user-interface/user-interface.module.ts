import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiDialogComponent } from './components/ui-dialog/ui-dialog.component';
import { UiButtonComponent } from './components/ui-button/ui-button.component';
import { UiInputComponent } from './components/ui-input/ui-input.component';
import { UiContentBoxComponent } from './components/ui-content-box/ui-content-box.component';
import { UiTableComponent } from './components/ui-table/ui-table.component';
import { UiColoredBoxComponent } from './components/ui-colored-box/ui-colored-box.component';
import { UiDigitInputComponent } from './components/ui-digit-input/ui-digit-input.component';
import { UiAmountInputComponent } from './components/ui-amount-input/ui-amount-input.component';
import { UiPreparingComponent } from './components/ui-preparing/ui-preparing.component';
import { UiDigipayLogoComponent } from './components/ui-digipay-logo/ui-digipay-logo.component';
import { UiCountDownTextComponent } from './components/ui-count-down-text/ui-count-down-text.component';
import { TableRowMarkDirective } from './components/ui-table/directives/table-row-mark.directive';
import { UiPurchaseInfoComponent } from './components/ui-purchase-info/ui-purchase-info.component';
import { UiCurrencyComponent } from './components/ui-currency/currency.component';
import { CurrencyPipe } from './components/ui-currency/currency.pipe';
import { UiImageComponent } from './components/ui-image/ui-image.component';
import { FormattedCellNumberPipe } from './pipes/formatted-cell-number.pipe';
import { CashInResultDialogComponent } from './dialogs/cash-in-result-dialog/cash-in-result-dialog.component';
import { CashInAmountDialogComponent } from './dialogs/cash-in-amount-dialog/cash-in-amount-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumericKeyboard } from './directives/numeric-keyboard.directive';
import { PayConfirmDialogComponent } from './dialogs/pay-confirm-dialog/pay-confirm-dialog.component';
import { OtpPinDialogComponent } from './dialogs/otp-pin-dialog/otp-pin-dialog.component';
import { UiInPageOtpComponent } from './components/ui-in-page-otp/ui-in-page-otp.component';
import { MaxlengthDirective } from './components/ui-table/directives/maxlength.directive';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SafeStylePipe } from './pipes/safe-style.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { UiAmountSuggestionsComponent } from './components/ui-amount-suggestions/ui-amount-suggestions.component';
import { UiSingleChoiceComponent } from './components/ui-single-choice/ui-single-choice.component';
import { PageDialogComponent } from './dialogs/page-dialog/page-dialog.component';
import { SubscriptionDialogComponent } from './dialogs/subscription-dialog/subscription-dialog.component';
import { SubscContractDialogComponent } from './dialogs/subsc-contract-dialog/subscription-dialog.component';
import { CancelContractDialogComponent } from './dialogs/cancel-contract-dialog/cancel-contract-dialog.component';
import { CreateContractDialogComponent } from './dialogs/create-contract-dialog/create-contract-dialog.component';
import { UiBadgeComponent } from './components/ui-badge/ui-badge.component';
import { UiCheckboxComponent } from './components/ui-checkbox/ui-checkbox.component';
import { UiAmountLabelBarComponent } from './components/ui-amount-label-bar/ui-amount-label-bar.component';
import { UiTemplateCardComponent } from './components/ui-template-card/ui-template-card.component';
import { UiContentCardComponent } from './components/ui-content-card/ui-content-card.component';
import { UiErrorRequestComponent } from './components/ui-error-request/ui-error-request.component';
import { UiBankItemComponent } from './components/ui-bank-item/ui-bank-item.component';
import { FormBuilderModule } from './form-builder/form-builder.module';
import { UiDebugWindowComponent } from './components/ui-debug-window/ui-debug-window.component';
import { SeparatorPipe } from './pipes/amount-separator.pipe';
import {
  CreateContractTitleContainerComponent
} from './dialogs/create-contract-dialog/create-contract-harvest-details-dialog/create-contract-title-container/create-contract-title-container.component';
import {
  CreateContractSelectBankDialogComponent
} from './dialogs/create-contract-dialog/create-contract-select-bank-dialog/create-contract-select-bank-dialog.component';
import {
  CreateContractHarvestDetailsDialogComponent
} from './dialogs/create-contract-dialog/create-contract-harvest-details-dialog/create-contract-harvest-details-dialog.component';
import {
  HARVEST_DETAIL_SHARE_DATA
} from './dialogs/create-contract-dialog/harvest-details-share-data-token';
import { BehaviorSubject } from 'rxjs';
import { HarvestDetailsShareData } from './dialogs/create-contract-dialog/harvest-details-share-data.model';
import { UpgActionDialogComponent } from './dialogs/upg-action-dialog/upg-action-dialog.component';
import { UiRemainingTimeComponent } from './components/ui-remaining-time/ui-remaining-time.component';
import { UiCircleCheckmarkComponent } from './components/ui-circle-checkmark/ui-circle-checkmark.component';
import { NeoPersianDatePipe } from './pipes/neo-persian-date.pipe';
import { UiReceiptComponent } from './components/ui-receipt/ui-receipt.component';
import { TranslateTimeUnitPipe } from './pipes/translate-time-unit.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { SecretInputDirective } from './directives/secret-input.directive';
import { NgxPaymentResult } from '@digipay/ngx-payment-result';

@NgModule({
  declarations: [
    UiDialogComponent,
    UiButtonComponent,
    UiInputComponent,
    UiContentBoxComponent,
    UiTableComponent,
    UiColoredBoxComponent,
    UiDigitInputComponent,
    UiAmountInputComponent,
    UiPreparingComponent,
    UiDigipayLogoComponent,
    UiCountDownTextComponent,
    TableRowMarkDirective,
    UiPurchaseInfoComponent,
    UiCurrencyComponent,
    CurrencyPipe,
    UiImageComponent,
    FormattedCellNumberPipe,
    UiInPageOtpComponent,
    MaxlengthDirective,
    SafeHtmlPipe,
    SafeStylePipe,
    SafeUrlPipe,
    SeparatorPipe,
    UiAmountSuggestionsComponent,
    UiSingleChoiceComponent,
    NumericKeyboard,
    UiBankItemComponent,
    UiBadgeComponent,
    UiCheckboxComponent,
    UiAmountLabelBarComponent,
    UiTemplateCardComponent,
    UiContentCardComponent,
    UiErrorRequestComponent,
    UiDebugWindowComponent,
    CreateContractTitleContainerComponent,
    // Dialogs
    CreateContractSelectBankDialogComponent,
    CreateContractHarvestDetailsDialogComponent,
    UpgActionDialogComponent,
    CashInResultDialogComponent,
    CashInAmountDialogComponent,
    PayConfirmDialogComponent,
    OtpPinDialogComponent,
    PageDialogComponent,
    SubscriptionDialogComponent,
    SubscContractDialogComponent,
    CancelContractDialogComponent,
    CreateContractDialogComponent,
    UiRemainingTimeComponent,
    UiCircleCheckmarkComponent,
    NeoPersianDatePipe,
    UiReceiptComponent,
    TranslateTimeUnitPipe,
    SecretInputDirective,
  ],
  exports: [
    UiDialogComponent,
    UiButtonComponent,
    UiInputComponent,
    UiContentBoxComponent,
    UiTableComponent,
    UiColoredBoxComponent,
    UiDigitInputComponent,
    UiAmountInputComponent,
    UiPreparingComponent,
    UiDigipayLogoComponent,
    UiCountDownTextComponent,
    TableRowMarkDirective,
    UiPurchaseInfoComponent,
    UiCurrencyComponent,
    CurrencyPipe,
    UiImageComponent,
    FormattedCellNumberPipe,
    UiInPageOtpComponent,
    MaxlengthDirective,
    SafeHtmlPipe,
    SafeStylePipe,
    SafeUrlPipe,
    UiAmountSuggestionsComponent,
    UiSingleChoiceComponent,
    NumericKeyboard,
    UiBankItemComponent,
    FormBuilderModule,
    UiAmountLabelBarComponent,
    // Dialogs
    CashInResultDialogComponent,
    CashInAmountDialogComponent,
    PayConfirmDialogComponent,
    OtpPinDialogComponent,
    PageDialogComponent,
    SubscriptionDialogComponent,
    SubscContractDialogComponent,
    CancelContractDialogComponent,
    CreateContractDialogComponent,
    UiBadgeComponent,
    UiCheckboxComponent,
    UiContentCardComponent,
    UiTemplateCardComponent,
    UiErrorRequestComponent,
    UiDebugWindowComponent,
    UpgActionDialogComponent,
    UiRemainingTimeComponent,
    UiCircleCheckmarkComponent,
    SeparatorPipe,
    NeoPersianDatePipe,
    UiReceiptComponent,
    TranslateTimeUnitPipe,
    SecretInputDirective,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    FormsModule,
    FormBuilderModule,
    NgxPaymentResult,
  ],
  providers: [
    {
      provide: HARVEST_DETAIL_SHARE_DATA,
      useFactory: () => {
        return new BehaviorSubject<HarvestDetailsShareData>(
          {
            isValidHarvestDetailsForm: true,
            maxDailyTransactionAmount: 0,
            minWalletBalance: 0,
          }
        );
      }
    }
  ]
})
export class UserInterfaceModule {
}
