import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { NewUpgComponent } from './new-upg.component';
import { NewUpgRoutingModule } from './new-upg-routing.module';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { CashInAndPayComponent } from './components/cash-in-and-pay/cash-in-and-pay.component';
import { TacComponent } from './components/tac/tac.component';
import { WalletPayComponent } from './components/wallet-pay/wallet-pay.component';
import { CardComponent } from './components/card/card.component';
import { CardHeaderComponent } from './components/card/components/card-header/card-header.component';
import { CardFooterComponent } from './components/card/components/card-footer/card-footer.component';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';
import { CommonModule } from '@angular/common';
import { HandleErrorService } from './services/handle-error.service';
import { UrlService } from './services/url.service';
import { PageManagementService } from './services/page-management.service';
import { FactoryService } from './services/factory.service';
import { TicketInfoService } from './services/ticket-info.service';
import { BadgeAlertComponent } from './components/badge-alert/badge-alert.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WalletBalanceService } from './services/wallet-balance.service';
import { CreditFeatureService } from './services/credit-feature.service';
import { DialogService } from './services/dialog.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PaymentMethodService } from './components/payment-method/services/payment-method.service';
import { PayByWalletService } from './components/wallet-pay/pay-by-wallet.service';
import { HintComponent } from './components/cash-in-and-pay/hint/hint.component';
import { FeatureInformationService } from './components/payment-method/services/feature-information.service';
import { UserInformationService } from './services/user-information.service';
import { RedirectCashInComponent } from './components/redirect-cash-in/redirect-cash-in.component';
import { BottomSheetService } from './services/bottom-sheet.service';
import { UiPinInputComponent } from '../../user-interface/components/new-pin-otp/ui-pin-input/ui-pin-input.component';
import { FormsModule } from '@angular/forms';
import { CloseSessionService } from './services/close-session.service';
import { AutoSubmitService } from './services/auto-submit.service';
import * as Sentry from "@sentry/angular-ivy";
import {Router} from "@angular/router";
import { UserCardHintComponent } from './components/cash-in-and-pay/user-card-hint/user-card-hint.component';
import {UserCardHintService} from "./components/cash-in-and-pay/user-card-hint/user-card-hint.service";
import {UserCardHintTooltipService} from "./components/cash-in-and-pay/user-card-tooltip/user-card-hint-tooltip.service";
import { UserCardTooltipComponent } from './components/cash-in-and-pay/user-card-tooltip/user-card-tooltip.component';
import { CPOtpComponent } from './components/new-cash-in-and-pay/c-p-otp/c-p-otp.component';
import { CPPinComponent } from './components/new-cash-in-and-pay/c-p-pin/c-p-pin.component';
import {OtpComponent} from "./components/otp/otp.component";
import {PinComponent} from "./components/pin/pin.component";
import {TimerService} from "./components/otp/timer.service";
import { ValidAmountComponent } from './components/new-cash-in-and-pay/c-and-p-valid-amount/valid-amount/valid-amount.component';
import { InvalidAmountComponent } from './components/new-cash-in-and-pay/c-and-p-invalid-amount/invalid-amount/invalid-amount.component';
import {CashInBackService} from "./components/new-cash-in-and-pay/cash-in-back.service";
import { CAndPInvalidAmountComponent } from './components/new-cash-in-and-pay/c-and-p-invalid-amount/c-and-p-invalid-amount.component';
import { CAndPValidAmountComponent } from './components/new-cash-in-and-pay/c-and-p-valid-amount/c-and-p-valid-amount.component';
import {CAndPPayService} from "./components/new-cash-in-and-pay/c-and-p-pay.service";
import {ConvertorDeepLinkToHttpsProtocol} from "./services/convertor-deeplink-url.service";

@NgModule({
  declarations: [
    NewUpgComponent,
    PaymentMethodComponent,
    CashInAndPayComponent,
    OtpComponent,
    PinComponent,
    TacComponent,
    WalletPayComponent,
    CardComponent,
    CardHeaderComponent,
    CardFooterComponent,
    BadgeAlertComponent,
    HintComponent,
    RedirectCashInComponent,
    UiPinInputComponent,
    UserCardHintComponent,
    UserCardTooltipComponent,
    CPOtpComponent,
    CPPinComponent,
    ValidAmountComponent,
    InvalidAmountComponent,
    CAndPInvalidAmountComponent,
    CAndPValidAmountComponent,
  ],
  imports: [
    UserInterfaceModule,
    CommonModule,
    NewUpgRoutingModule,
    MatTooltipModule,
    MatDialogModule,
    MatBottomSheetModule,
    FormsModule,
  ],
  exports: [MatBottomSheetModule],
  providers: [
    FactoryService,
    PageManagementService,
    TicketInfoService,
    HandleErrorService,
    WalletBalanceService,
    CreditFeatureService,
    DialogService,
    UrlService,
    PaymentMethodService,
    PayByWalletService,
    TimerService,
    FeatureInformationService,
    UserInformationService,
    BottomSheetService,
    CloseSessionService,
    AutoSubmitService,
    UserCardHintService,
    UserCardHintTooltipService,
    CashInBackService,
    CAndPPayService,
    ConvertorDeepLinkToHttpsProtocol,
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
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
  ]
})
export class NewUpgModule {
}
