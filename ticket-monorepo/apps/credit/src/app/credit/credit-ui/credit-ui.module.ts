import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBoxComponent } from './content-box/content-box.component';
import { CountdownModule } from 'ngx-countdown';
import { CreditPaymentOptionsComponent } from './credit-payment-options/credit-payment-options.component';
import { CreditPaymentOptionComponent } from './credit-payment-options/payment-option/credit-payment-option.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { SharedModule } from '../shared';
import { CurrencyComponent } from './currency/currency.component';
import { FormattedPricePipe } from './currency/currency.pipe';
import { CellNumberPipe } from './pipes/cellNumber.pipe';
import { SmartDropDownService } from './smart-drop-down/smart-drop-down.service';
import { CheckboxListComponent } from './checkbox-list/checkbox-list.component';
import { InputDropDownComponent } from './smart-drop-down/input-drop-down/input-drop-down.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { PageDialogComponent } from './page-dialog/page-dialog.component';
import { PageTitleBarComponent } from './page-title-bar/page-title-bar.component';
import { SwitchComponent } from './switch/switch.component';
import {
  PaymentOptionDialogComponent
} from './credit-payment-options/payment-option-dialog/payment-option-dialog.component';
import { DigipayDialogComponent } from './digipay-dialog/digipay-dialog.component';
import { CreditUiAmountInputComponent } from './amount-input/credit-ui-amount-input.component';
import { ContentBoxFooterDirective } from './content-box/marks/content-box-footer.directive';
import { UiFormModule } from './ui-form/ui-form.module';
import { IranianRialsPipe } from './pipes/iranian-rials.pipe';
import { CartImageComponent } from './cart-image/cart-image.component';
import { AlertMessageBoxComponent } from './alert-message-box/alert-message-box.component';
import { LocationTrapComponent } from './location-trap/location-trap.component';
import { SelectiveCardComponent } from './selective-card/selective-card.component';
import { FoundProviderLogoComponent } from './found-provider-logo/found-provider-logo.component';
import { HorizontalStepperComponent } from './horizontal-stepper/horizontal-stepper.component';
import { StepperContentComponent } from './horizontal-stepper/stepper-content/stepper-content.component';
import { CreditConfirmBottomSheetComponent } from './credit-confirm-bottom-sheet/credit-confirm-bottom-sheet.component';
import { CreditCheckboxComponent } from './credit-checkbox/credit-checkbox.component';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { CreditCountdownComponent } from './credit-countdown/credit-countdown.component';
import { GoogleAnalyticsDirective } from '../shared/directives/google-analytics.directive';

@NgModule({
  declarations: [
    ContentBoxComponent,
    CreditPaymentOptionsComponent,
    CreditPaymentOptionComponent,
    RadioButtonComponent,
    CurrencyComponent,
    FormattedPricePipe,
    CellNumberPipe,
    CheckboxListComponent,
    InputDropDownComponent,
    CheckboxComponent,
    CreditCheckboxComponent,
    PageDialogComponent,
    PageTitleBarComponent,
    SwitchComponent,
    PaymentOptionDialogComponent,
    DigipayDialogComponent,
    CreditUiAmountInputComponent,
    ContentBoxFooterDirective,
    IranianRialsPipe,
    CartImageComponent,
    AlertMessageBoxComponent,
    LocationTrapComponent,
    SelectiveCardComponent,
    FoundProviderLogoComponent,
    HorizontalStepperComponent,
    StepperContentComponent,
    CreditConfirmBottomSheetComponent,
    CreditCountdownComponent
  ],
  exports: [
    ContentBoxComponent,
    CreditPaymentOptionComponent,
    CreditPaymentOptionsComponent,
    FormattedPricePipe,
    CurrencyComponent,
    CellNumberPipe,
    CheckboxListComponent,
    InputDropDownComponent,
    CheckboxComponent,
    CreditCheckboxComponent,
    PageTitleBarComponent,
    SwitchComponent,
    PaymentOptionDialogComponent,
    DigipayDialogComponent,
    CreditUiAmountInputComponent,
    ContentBoxFooterDirective,
    UiFormModule,
    IranianRialsPipe,
    CartImageComponent,
    AlertMessageBoxComponent,
    LocationTrapComponent,
    SelectiveCardComponent,
    HorizontalStepperComponent,
    StepperContentComponent,
    CreditConfirmBottomSheetComponent,
    CreditCountdownComponent
  ],
  imports: [
    CommonModule,
    CountdownModule,
    SharedModule,
    UiFormModule,
    ApiImageModule,
    GoogleAnalyticsDirective,
  ],
  providers: [
    SmartDropDownService,
  ]
})
export class CreditUiModule {
}
