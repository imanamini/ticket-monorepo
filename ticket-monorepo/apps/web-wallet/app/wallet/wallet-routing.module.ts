import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WalletCashInComponent } from './wallet-cash-in/wallet-cash-in.component';
import { WalletActivateComponent } from './wallet-activate/wallet-activate.component';
import { WalletTestComponent } from './wallet-test/wallet-test.component';
import { OtpVerificationComponent } from './auth/otp-verification/otp-verification.component';
import { PaymentResultComponent } from './payment-result/payment-result.component';
import { WalletActivatedComponent } from './wallet-activate/wallet-activated/wallet-activated.component';
import { WalletSubscriptionComponent } from './wallet-subscription/wallet-subscription.component';
import {
  ManageSubscriptionsComponent
} from './wallet-subscription/manage-subscriptions/manage-subscriptions.component';
import {
  SubscriptionSuccessComponent
} from './wallet-subscription/subscription-success/subscription-success.component';
import { DevOnlyGuard } from '../core/guards/dev-only.guard';
import { TicketGuard } from '../core/guards/ticket.guard';
import {
  DirectDebitManagementComponent
} from './direct-debit/direct-debit-management/direct-debit-management.component';
import { DirectDebitResultComponent } from './direct-debit/direct-debit-result/direct-debit-result.component';
import { DirectDebitContractComponent } from './direct-debit/direct-debit-contract/direct-debit-contract.component';
import {
  DirectDebitTokenTransitionComponent
} from './direct-debit/direct-debit-token-transition/direct-debit-token-transition.component';
import { DirectDebitCallbackComponent } from './direct-debit/direct-debit-callback/direct-debit-callback.component';
import { ServiceConnectionComponent } from './error-pages/service-connection/service-connection.component';
import { TicketExpiredComponent } from './error-pages/ticket-expired/ticket-expired.component';
import { OfflineComponent } from './error-pages/offline/offline.component';
import {ReceiptComponent} from "./cash-out/components/receipt/receipt.component";

const routes: Routes = [
  /*
  |--------------------------------------------------------------------------
  | MAIN ENTRY POINTS
  |--------------------------------------------------------------------------
  | Main routes of the application
  */
  {
    path: 'offline/:ticket',
    component: OfflineComponent
  },
  {
    path: 'service-connection/:ticket',
    component: ServiceConnectionComponent
  },
  {
    path: 'ticket-expired/:ticket',
    component: TicketExpiredComponent
  },
  {
    path: 'activation/:ticket',
    component: WalletActivateComponent,
    canActivate: [TicketGuard],
  },
  {
    path: 'wallet-cash-in/:ticket',
    component: WalletCashInComponent,
    canActivate: [TicketGuard],
  },
  /*
  |--------------------------------------------------------------------------
  | VERIFICATION
  |--------------------------------------------------------------------------
  | Authenticate user with OTP
  */
  {
    path: 'auth/otp',
    component: OtpVerificationComponent,
  },
  /*
  |--------------------------------------------------------------------------
  | Final Pages
  |--------------------------------------------------------------------------
  | Payment result page & wallet activated page. These routes are shown
  | when user finishes a main scenario (payment/activation)
  */
  {
    path: 'payment/result',
    component: PaymentResultComponent,
  },
  {
    path: 'payment/result/:ticket',
    component: PaymentResultComponent,
  },
  {
    path: 'wallet/activated',
    component: WalletActivatedComponent,
  },
  /*
  |--------------------------------------------------------------------------
  | SUBSCRIPTION
  |--------------------------------------------------------------------------
  | Subscription pages. These routes are shown
  | when user requested for subscribe in digi-plus
  */
  {
    path: 'subscription/:ticket',
    component: WalletSubscriptionComponent,
  },
  {
    path: 'manage-subscriptions/:ticket/:ticketType',
    component: ManageSubscriptionsComponent,
  },
  {
    path: 'success-subscriptions/:ticket',
    component: SubscriptionSuccessComponent,
  },

  /*
  |--------------------------------------------------------------------------
  | TGS
  |--------------------------------------------------------------------------
  | TGS (New UPG) pages. These routes are shown
  */

  {
    path: 'tgs/:ticket',
    loadChildren: () => import('./new-upg/new-upg.module').then(m => m.NewUpgModule)
  },
  {
    path: 'tgs',
    loadChildren: () => import('./new-upg/new-upg.module').then(m => m.NewUpgModule),
  },
  {
    path: 'wallet-management/:token',
    loadChildren: () => import('./wallet-management/wallet-management.module').then(m => m.WalletManagementModule)
  },
  {
    path: 'cash-out/:ticket',
    loadChildren: () => import('./cash-out/cash-out-page.module').then(m => m.CashOutPageModule),
  },
  {
    path:'cash-out-receipt/:ticket',
    component:ReceiptComponent
  },
  /*
  |--------------------------------------------------------------------------
  | Direct Debit
  |--------------------------------------------------------------------------
  | Direct debit pages.
  */
  {
    path: 'direct-debit/token-transition',
    component: DirectDebitTokenTransitionComponent,
  },
  {
    path: 'direct-debit/management/:ticket',
    component: DirectDebitManagementComponent,
  },
  {
    path: 'direct-debit/result',
    component: DirectDebitResultComponent,
  },
  {
    path: 'direct-debit/contract/:ticket',
    component: DirectDebitContractComponent,
  },
  {
    path: 'direct-debit/external',
    loadChildren: () => import('./direct-debit-digiplus/direct-debit-digiplus.module').then(m => m.DirectDebitDigiplusModule)
  },
  {
    path: 'direct-debit-v2/external',
    loadChildren: () => import('./direct-debit-digiplus-v2/direct-debit-digiplus-v2.module').then(m => m.DirectDebitDigiplusV2Module)
  },
  {
    path: 'direct-debit/callback',
    component: DirectDebitCallbackComponent,
  },

  /*
  |--------------------------------------------------------------------------
  | OLD ROUTES
  |--------------------------------------------------------------------------
  | These routes are only for making the app compatible with the previously
  | published routes.
  |
  */
  {
    path: 'cash-in-result',
    redirectTo: 'payment/result',
  },
  /*
  {
    path: 'cash-in/:ticket',
    component: WebPayComponent,
    canActivate: [GlobalAuthGuard],
  },
  */

  /*
  |--------------------------------------------------------------------------
  | TEST ONLY
  |--------------------------------------------------------------------------
  | BE CAREFUL ABOUT THESE ROUTES! ONLY FOR DEVELOPER TEST.
  |
  */
  {
    path: 'wallet/test',
    component: WalletTestComponent,
    canActivate: [DevOnlyGuard],
  },

  {
    path: '',
    redirectTo:'wallet/test',
    pathMatch:'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule {
}
