import {Injectable, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletRoutingModule } from './wallet-routing.module';
import { WalletCashInComponent } from './wallet-cash-in/wallet-cash-in.component';
import { WalletActivateComponent } from './wallet-activate/wallet-activate.component';
import { UserInterfaceModule } from '../user-interface/user-interface.module';
import { WalletTestComponent } from './wallet-test/wallet-test.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OtpVerificationComponent } from './auth/otp-verification/otp-verification.component';
import { VerificationService } from './auth/verification.service';
import { PaymentResultComponent } from './payment-result/payment-result.component';
import { TestCashInComponent } from './wallet-test/test-cash-in/test-cash-in.component';
import { TestActivateComponent } from './wallet-test/test-activate/test-activate.component';
import { ActivationIntroComponent } from './wallet-activate/activation-intro/activation-intro.component';
import { WalletActivatedComponent } from './wallet-activate/wallet-activated/wallet-activated.component';
import { TestSubscriptionComponent } from './wallet-test/test-subscription/test-subscription.component';
import { TestManageSubscriptionsComponent } from './wallet-test/test-manage-subscriptions/test-manage-subscriptions.component';
import { WalletSubscriptionComponent } from './wallet-subscription/wallet-subscription.component';
import { ManageSubscriptionsComponent } from './wallet-subscription/manage-subscriptions/manage-subscriptions.component';
import {
  UiSubscriptionCancelCardComponent
} from './wallet-subscription/components/ui-subscription-cancel-card/ui-subscription-cancel-card.component';
import { UiTemplateItemComponent } from './wallet-subscription/components/ui-template-item/ui-template-item.component';
import { SubscriptionSuccessComponent } from './wallet-subscription/subscription-success/subscription-success.component';
import { DirectDebitManagementComponent } from './direct-debit/direct-debit-management/direct-debit-management.component';
import { DirectDebitResultComponent } from './direct-debit/direct-debit-result/direct-debit-result.component';
import { DirectDebitContractComponent } from './direct-debit/direct-debit-contract/direct-debit-contract.component';
import { TestDirectDebitComponent } from './wallet-test/test-direct-debit/test-direct-debit.component';
import { DirectDebitTokenTransitionComponent } from './direct-debit/direct-debit-token-transition/direct-debit-token-transition.component';
import { DirectDebitCallbackComponent } from './direct-debit/direct-debit-callback/direct-debit-callback.component';
import { CashInAppletModule } from '../user-interface/cash-in-applet/cash-in-applet.module';
import { CodeProtectionAppletModule } from '../user-interface/code-protection-applet/code-protection-applet.module';
import { TestTgsComponent } from './wallet-test/test-tgs/test-tgs.component';
import { WithdrawalDetailsDigiplusComponent } from './direct-debit/withdrawal-details-digiplus/withdrawal-details-digiplus.component';
import { TestDigiplusDirectDebitComponent } from './wallet-test/test-digiplus-direct-debit/test-digiplus-direct-debit.component';
import { CashInResultComponent } from './direct-debit/direct-debit-result/cash-in-result/cash-in-result.component';
import { DigiplusResultComponent } from './direct-debit/direct-debit-result/digiplus-result/digiplus-result.component';
import { TestTgsCashInComponent } from './wallet-test/test-tgs-cash-in/test-tgs-cash-in.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OfflineComponent } from './error-pages/offline/offline.component';
import { ServiceConnectionComponent } from './error-pages/service-connection/service-connection.component';
import { TicketExpiredComponent } from './error-pages/ticket-expired/ticket-expired.component';
import { TestDigiplusDirectDebitV2Component } from './wallet-test/test-digiplus-direct-debit-v2/test-digiplus-direct-debit-v2.component';
import {TestCashOutComponent} from "./wallet-test/test-cash-out/test-cash-out.component";


@NgModule({
  declarations: [
    WalletCashInComponent,
    WalletActivateComponent,
    WalletTestComponent,
    OtpVerificationComponent,
    PaymentResultComponent,
    TestCashInComponent,
    TestActivateComponent,
    ActivationIntroComponent,
    WalletActivatedComponent,
    TestSubscriptionComponent,
    TestManageSubscriptionsComponent,
    TestDirectDebitComponent,
    WalletSubscriptionComponent,
    ManageSubscriptionsComponent,
    UiSubscriptionCancelCardComponent,
    UiTemplateItemComponent,
    SubscriptionSuccessComponent,
    DirectDebitManagementComponent,
    DirectDebitResultComponent,
    DirectDebitContractComponent,
    DirectDebitTokenTransitionComponent,
    DirectDebitCallbackComponent,
    TestTgsComponent,
    WithdrawalDetailsDigiplusComponent,
    TestDigiplusDirectDebitComponent,
    CashInResultComponent,
    DigiplusResultComponent,
    TestTgsCashInComponent,
    OfflineComponent,
    ServiceConnectionComponent,
    TicketExpiredComponent,
    TicketExpiredComponent,
    TestDigiplusDirectDebitV2Component,
  ],
  imports: [
    CommonModule,
    WalletRoutingModule,
    UserInterfaceModule,
    FormsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    CashInAppletModule,
    CodeProtectionAppletModule,
    TestCashOutComponent,
  ],
  providers: [
    VerificationService,

  ]
})
export class WalletModule {
}
