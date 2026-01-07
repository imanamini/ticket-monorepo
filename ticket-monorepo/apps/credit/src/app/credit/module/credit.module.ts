import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditComponent } from './credit.component';
import { CreditRoutingModule } from './credit-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CountdownModule } from 'ngx-countdown';
import { ErrorComponent } from './error/error.component';
import { CoreModule } from '../core';
import { SharedModule } from '../shared';
import { CreditHomeComponent } from './credit-home/credit-home.component';
import { CreditUiModule } from '../credit-ui/credit-ui.module';
import { PayAmountComponent } from './pay/pay-flow/pay-amount.component';
import { CancelAndGoBackComponent } from './cancel-and-go-back/cancel-and-go-back.component';
import { NoAccountComponent } from './pay/no-account/no-account.component';
import { NeoPayDetailsComponent } from './pay/neo-pay-details/neo-pay-details.component';
import { FormFieldBuilderModule } from '../shared/form-field-builder/form-field-builder.module';
import {
  StandardCardsOptionCardComponent
} from './pay/standard-cards-option-card/standard-cards-option-card.component';
import {
  StandardCardsBottomSheetComponent
} from './pay/standard-cards-bottom-sheet/standard-cards-bottom-sheet.component';
import { OfferCardComponent } from './pay/offer-card/offer-card.component';
import {
  EditCreditAmountBottomSheetComponent
} from './pay/edit-credit-amount-bottom-sheet/edit-credit-amount-bottom-sheet.component';
import { CardPayFlowComponent } from './pay/card-pay-flow/card-pay-flow.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { SignContractComponent } from './pay/neo-pay-details/sign-contract/sign-contract.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ScrollableViewComponent } from '../shared/components/scrollable-view/scrollable-view.component';

@NgModule({
  declarations: [
    CreditComponent,
    ErrorComponent,
    CreditHomeComponent,
    PayAmountComponent,
    CancelAndGoBackComponent,
    NoAccountComponent,
    NeoPayDetailsComponent,
    StandardCardsOptionCardComponent,
    StandardCardsBottomSheetComponent,
    OfferCardComponent,
    EditCreditAmountBottomSheetComponent,
    CardPayFlowComponent,
    SignContractComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    CreditUiModule,
    CreditRoutingModule,
    MatChipsModule,
    MatAutocompleteModule,
    CountdownModule,
    FormFieldBuilderModule,
    MatTooltipModule,
    UiFormFieldBuilderModule,
    NgxButtonComponent,
    ScrollableViewComponent,
  ],
})
export class CreditModule {
}
