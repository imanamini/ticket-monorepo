import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashOutPageRoutingModule } from './cash-out-page-routing.module';
import { CashOutPageComponent } from './cash-out-page.component';
import { CashOutHeaderComponent } from './components/cash-out-header/cash-out-header.component';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ChooseCardComponent } from './components/choose-card/choose-card.component';
import { ChooseAmountComponent } from './components/choose-amount/choose-amount.component';
import { TacService } from './services/tac.service';
import { TomanConvertorPipe } from './utiles/toman-convertor.pipe';
import { AddNewCardComponent } from './components/add-new-card/add-new-card.component';
import { ScreenService } from './services/screen.service';
import {
  ChooseAmountFooterComponent
} from './components/choose-amount/choose-amount-footer/choose-amount-footer.component';
import { AmountInfoComponent } from './components/choose-amount/amount-info/amount-info.component';
import { CardService } from './services/card.service';
import {
  ConfirmationOfWithdrawalInformationComponent
} from './components/confirmation-of-withdrawal-information/confirmation-of-withdrawal-information.component';
import { BankService } from './services/bank.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterWithCurrencyComponent } from './components/footer-with-currency/footer-with-currency.component';
import {
  CashOutInformationComponent
} from './components/confirmation-of-withdrawal-information/cash-out-information/cash-out-information.component';
import { CashOutProcessService } from './services/cash-out-process.service';
import { CardComponent } from './components/choose-card/card/card.component';
import {
  ConfirmationFooterComponent
} from './components/confirmation-of-withdrawal-information/confirmation-footer/confirmation-footer.component';
import {
  CardInformationComponent
} from './components/confirmation-of-withdrawal-information/card-information/card-information.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { AutoAddNewCardComponent } from './components/auto-add-new-card/auto-add-new-card.component';
import {UiScrollerModule} from "../../user-interface/ui-scroller/ui-scroller.module";
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import {UserInterfaceModule} from "../../user-interface/user-interface.module";
import {BankCardComponent} from "./components/bank-card/bank-card/bank-card.component";
import {amountInputComponent} from "./components/ui-amount-input/ui-amount-input/ui-amount-input.component";
import {UiCardNumberInputModule} from "./components/ui-card-number-input/ui-card-number-input.module";
import {UiTextFieldComponent} from "./components/text-field/ui-text-field.component";
import {TICKET_TOKEN} from "./utiles/ticket-token";
import {BehaviorSubject} from "rxjs";
import {CashOutService} from "./services/cash-out.service";

@NgModule({
  declarations: [
    CashOutPageComponent,
    CashOutHeaderComponent,
    ChooseCardComponent,
    ChooseAmountComponent,
    TomanConvertorPipe,
    AddNewCardComponent,
    ChooseAmountFooterComponent,
    AmountInfoComponent,
    ConfirmationOfWithdrawalInformationComponent,
    FooterWithCurrencyComponent,
    CashOutInformationComponent,
    CardComponent,
    ConfirmationFooterComponent,
    CardInformationComponent,
    AutoAddNewCardComponent,
  ],
  imports: [
    CommonModule,
    CashOutPageRoutingModule,
    MatDialogModule,
    MatBottomSheetModule,
    CarouselModule,
    UiFormFieldBuilderModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    UiScrollerModule,
    UserInterfaceModule,
    BankCardComponent,
    amountInputComponent,
    UiCardNumberInputModule,
    UiTextFieldComponent,
  ],
  providers: [
    TacService,
    ScreenService,
    CardService,
    BankService,
    CashOutProcessService,
    CashOutService,
    {
      provide: MatDialogRef, useValue: () => {
      }
    },
    {
      provide: MatBottomSheetRef, useValue: () => {
      }
    },
    {
      provide: MAT_DIALOG_DATA, useValue: () => {
      }
    },
    {
      provide: MAT_BOTTOM_SHEET_DATA, useValue: () => {
      }
    },
    {
      provide:TICKET_TOKEN,
      useFactory:()=>{
        return new BehaviorSubject('');
      }
    }
  ],
})
export class CashOutPageModule {
}
