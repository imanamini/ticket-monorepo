import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditWrapperComponent } from './credit-wrapper/credit-wrapper.component';
import { creditOverviewGuard } from './overview-redirect.guard';
import { retryImport } from './data-access/utils/retry-import-hanlder';

export const routes: Routes = [
  {
    path: '',
    component: CreditWrapperComponent,
    children: [
      {
        path: 'resolve',
        loadComponent: () =>
          retryImport(() => import('./credit-resolve-status/credit-resolve-status.component')).then((c) => c.CreditResolveStatusComponent),
      },
      /*
      |--------------------------------------------------------------------------
      | Wallet Activation
      |--------------------------------------------------------------------------
      |
      */
      {
        path: 'overview',
        canActivate: [creditOverviewGuard],
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/dashboard/credit-wallet-activation-dashboard.component')).then(
            (c) => c.CreditWalletActivationDashboardComponent,
          ),
        title: 'وام و اعتبار',
        data: { preload: true, critical: true },
      },
      {
        path: 'pay-debt/:fundProviderCode',
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/dashboard/credit-wallet-activation-dashboard.component')).then(
            (c) => c.CreditWalletActivationDashboardComponent,
          ),
      },
      {
        path: 'go-to-wallet/:creditId',
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/dashboard/credit-wallet-activation-dashboard.component')).then(
            (c) => c.CreditWalletActivationDashboardComponent,
          ),
      },
      {
        path: 'wallet/tac',
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/tac-page/credit-tac-page.component')).then((c) => c.CreditTacPageComponent),
      },
      {
        path: 'wallet/activation/steps',
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/activation-steps/credit-activation-steps.component')).then(
            (c) => c.CreditActivationStepsComponent,
          ),
      },
      {
        path: 'wallet/activation/steps/:fundProviderCode/:creditId',
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/activation-steps/credit-activation-steps.component')).then(
            (c) => c.CreditActivationStepsComponent,
          ),
      },
      {
        path: 'wallet/activation/steps/:fundProviderCode/:creditId/:action',
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/activation-steps/credit-activation-steps.component')).then(
            (c) => c.CreditActivationStepsComponent,
          ),
      },
      {
        path: 'wallet/activation/upload',
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/credit-upload/credit-upload-document/credit-upload-document.component')).then(
            (c) => c.CreditUploadDocumentComponent,
          ),
      },
      {
        path: 'wallet/activation/cheque',
        loadChildren: () =>
          retryImport(() => import('./wallet-activation/credit-cheque-step/credit-cheque-step-routing.module')).then(
            (m) => m.CreditChequeStepRoutingModule,
          ),
      },
      {
        path: 'wallet/activation/payment/:fundProviderCode/:creditId',
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/credit-payment-step/credit-payment-step.component')).then(
            (c) => c.CreditPaymentStepComponent,
          ),
      },
      {
        path: 'wallet/activation/payment/result/:fundProviderCode/:creditId',
        loadComponent: () =>
          retryImport(
            () => import('./wallet-activation/credit-payment-step/credit-payment-step-result/credit-payment-step-result.component'),
          ).then((c) => c.CreditPaymentStepResultComponent),
      },
      {
        path: 'wallet/activation/pre-payment/:fundProviderCode/:creditId',
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/credit-pre-payment-step/credit-pre-payment-step.component')).then(
            (c) => c.CreditPrePaymentStepComponent,
          ),
      },
      {
        path: 'wallet/activation/pre-payment/result/:fundProviderCode/:creditId',
        loadComponent: () =>
          retryImport(
            () =>
              import('./wallet-activation/credit-pre-payment-step/credit-pre-payment-step-result/credit-pre-payment-step-result.component'),
          ).then((c) => c.CreditPrePaymentStepResultComponent),
      },
      {
        path: 'wallet/activation/bank-account-verification/:fundProviderCode/:creditId',
        loadComponent: () =>
          retryImport(
            () => import('./wallet-activation/credit-bank-account-verification-step/credit-bank-account-verification-step.component'),
          ).then((c) => c.CreditBankAccountVerificationStepComponent),
      },
      {
        path: 'wallet/activation/bank-account-verification/:fundProviderCode/:creditId/shahab-help',
        loadComponent: () =>
          retryImport(
            () =>
              import(
                './wallet-activation/credit-bank-account-verification-step/credit-bank-account-verification-step-shahab-help/credit-bank-account-verification-step-shahab-help.component'
              ),
          ).then((c) => c.CreditBankAccountVerificationStepShahabHelpComponent),
      },
      {
        path: 'wallet/activation/digital-sign-contract/:fundProviderCode/:creditId',
        loadComponent: () =>
          retryImport(
            () => import('./wallet-activation/credit-digital-sign-contract-step/credit-digital-sign-contract-step.component'),
          ).then((c) => c.CreditDigitalSignContractStepComponent),
      },
      {
        path: 'wallet/activation/generate-digital-sign-contract/kyc-result/:fundProviderCode/:creditId',
        redirectTo: 'wallet/activation/generate-digital-sign-contract/v2/:fundProviderCode/:creditId',
      },
      {
        path: 'wallet/activation/generate-digital-sign-contract/v2/:fundProviderCode/:creditId',
        loadChildren: () =>
          retryImport(
            () => import('./wallet-activation/credit-generate-digital-signature/credit-generate-digital-signature-routing.module'),
          ).then((m) => m.CreditGenerateDigitalSignatureRoutingModule),
      },
      {
        path: 'wallet/activation/signing-documents/:fundProviderCode/:creditId',
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/credit-signing-documents-step/credit-signing-documents-step.component')).then(
            (c) => c.CreditSigningDocumentsStepComponent,
          ),
      },
      {
        path: 'wallet/activation/check-credit-file/:fundProviderCode/:creditId',
        loadComponent: () =>
          retryImport(
            () => import('./wallet-activation/check-credit-file-step/check-credit-file-step/check-credit-file-step.component'),
          ).then((m) => m.CheckCreditFileStepComponent),
      },
      {
        path: 'wallet/activation/enote',
        loadChildren: () =>
          retryImport(() => import('./wallet-activation/credit-enote-step/credit-enote-step-routing.module')).then(
            (m) => m.CreditEnoteStepRoutingModule,
          ),
      },
      {
        path: 'wallet/activation/account-block/:fundProviderCode/:creditId',
        loadComponent: () =>
          retryImport(
            () => import('./wallet-activation/credit-account-block-step/credit-account-block-step/credit-account-block-step.component'),
          ).then((c) => c.CreditAccountBlockStepComponent),
      },
      {
        path: 'score/show',
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/show-credit-score/show-credit-score.component')).then(
            (c) => c.ShowCreditScoreComponent,
          ),
      },
      {
        path: 'wallet/activation/profile/:fundProviderCode/:creditId',
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/credit-profile-step/credit-profile-step.component')).then(
            (c) => c.CreditProfileStepComponent,
          ),
      },
      {
        path: 'wallet/detail',
        loadComponent: () =>
          retryImport(() => import('./credit-wallet-detail/credit-wallet-detail.component')).then((c) => c.CreditWalletDetailComponent),
      },
      {
        path: 'wallet/detail/:fundProviderCode/:creditId',
        loadComponent: () =>
          retryImport(() => import('./credit-wallet-detail/credit-wallet-detail.component')).then((c) => c.CreditWalletDetailComponent),
      },
      {
        path: 'wallet/detail/:creditId',
        loadComponent: () =>
          retryImport(() => import('./credit-wallet-detail/credit-wallet-detail.component')).then((c) => c.CreditWalletDetailComponent),
      },
      {
        path: 'installment/pay',
        loadComponent: () =>
          retryImport(() => import('./credit-wallet-detail/credit-installment-payment/credit-installment-payment.component')).then(
            (c) => c.CreditInstallmentPaymentComponent,
          ),
        data: { preload: true, critical: true },
      },
      {
        path: 'installment/pay/:creditId',
        loadComponent: () =>
          retryImport(() => import('./credit-wallet-detail/credit-installment-payment/credit-installment-payment.component')).then(
            (c) => c.CreditInstallmentPaymentComponent,
          ),
      },
      {
        path: 'installment/pay/bank-account/:creditId/:amount',
        loadComponent: () =>
          retryImport(
            () => import('./credit-wallet-detail/credit-installment-bank-account/credit-installment-bank-account.component'),
          ).then((c) => c.CreditInstallmentBankAccountComponent),
      },
      {
        path: 'total-installments',
        loadComponent: () =>
          retryImport(() => import('./total-installments/total-installments.component')).then((c) => c.TotalInstallmentsComponent),
      },
      {
        path: 'installments-overview',
        loadComponent: () =>
          retryImport(() => import('./installments-overview/installments-overview.component')).then((c) => c.InstallmentsOverviewComponent),
        data: { preload: true, critical: true },
      },
      {
        path: 'contract/detail/:contractTrackingCode/:creditId',
        loadComponent: () =>
          retryImport(() => import('./credit-wallet-detail/credit-wallet-contract-detail/credit-wallet-contract-detail.component')).then(
            (c) => c.CreditWalletContractDetailComponent,
          ),
      },
      {
        path: 'installment/pay/confirm',
        loadComponent: () =>
          retryImport(() => import('./credit-wallet-detail/installment-pay-confirm-neo/installment-pay-confirm-neo.component')).then(
            (c) => c.InstallmentPayConfirmNeoComponent,
          ),
      },
      {
        path: 'early-settlement/pay/:creditId/:amount',
        loadComponent: () =>
          retryImport(
            () =>
              import(
                './credit-wallet-detail/credit-early-settlement/credit-early-settlement-payment-confirm/credit-early-settlement-payment-confirm.component'
              ),
          ).then((c) => c.CreditEarlySettlementPaymentConfirmComponent),
      },
      {
        path: 'early-settlement/pay-result/:creditId',
        loadComponent: () =>
          retryImport(
            () =>
              import(
                './credit-wallet-detail/credit-early-settlement/credit-early-settlement-payment-result/credit-early-settlement-payment-result.component'
              ),
          ).then((c) => c.CreditEarlySettlementPaymentResultComponent),
      },
      {
        path: 'contract-purchase/:contractTrackingCode/:creditId',
        loadComponent: () =>
          retryImport(() => import('./credit-wallet-detail/credit-contract-transactions/credit-contract-transactions.component')).then(
            (c) => c.CreditContractTransactionsComponent,
          ),
      },
      {
        path: 'wallet-transactions/:creditId',
        loadComponent: () =>
          retryImport(() => import('./credit-wallet-detail/credit-wallet-transactions/credit-wallet-transactions.component')).then(
            (c) => c.CreditWalletTransactionsComponent,
          ),
      },
      {
        path: 'wallet/activated',
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/wallet-activated/wallet-activated.component')).then(
            (c) => c.WalletActivatedComponent,
          ),
      },
      {
        path: 'wallet/activation/step–info',
        loadComponent: () =>
          retryImport(() => import('./wallet-activation/credit-upload/step-info/step-info.component')).then((c) => c.StepInfoComponent),
      },
      {
        path: 'onboarding',
        loadComponent: () =>
          retryImport(() => import('./credit-onboarding/credit-onboarding.component')).then((c) => c.CreditOnboardingComponent),
      },
      {
        path: 'volunteer/view',
        loadComponent: () =>
          retryImport(() => import('./credit-volunteer-page/credit-volunteer-page.component')).then((c) => c.CreditVolunteerPageComponent),
      },
      {
        path: 'score',
        loadChildren: () =>
          retryImport(() => import('./wallet-activation/credit-scoring-step/credit-scoring-step.module')).then(
            (m) => m.CreditScoringStepModule,
          ),
      },
      {
        path: 'smc-score',
        loadChildren: () =>
          retryImport(() => import('./wallet-activation/credit-scoring-smc-step/credit-scoring-smc-step-routing.module')).then(
            (m) => m.CreditScoringSmcStepRoutingModule,
          ),
      },
      {
        path: 'contract/detail/:contractTrackingCode/:fundProviderCode/:creditId',
        loadComponent: () =>
          retryImport(() => import('./credit-wallet-detail/credit-contract-detail/credit-contract-detail.component')).then(
            (c) => c.CreditContractDetailComponent,
          ),
      },
      {
        path: 'pre-register-by-campaign/:campaignId',
        loadComponent: () =>
          retryImport(() => import('./pre-registration-by-campaign-data/pre-registration-by-campaign-data.component')).then(
            (c) => c.PreRegistrationByCampaignDataComponent,
          ),
      },
      {
        path: 'transaction-detail/:trackingCode',
        loadComponent: () =>
          retryImport(() => import('./credit-transaction-detail/credit-transaction-detail.component')).then(
            (c) => c.CreditTransactionDetailComponent,
          ),
      },
      {
        path: 'payment-result/:transactionCallbackType',
        loadComponent: () =>
          retryImport(() => import('./credit-payment-callback/credit-payment-callback.component')).then(
            (c) => c.CreditPaymentCallbackComponent,
          ),
      },
      /*
      Callback for ipg error when we don't have any data
       */
      {
        path: 'ipg-error-empty',
        loadComponent: () =>
          retryImport(() => import('./credit-ipg-error-empty-data/credit-ipg-error-empty-data.component')).then(
            (c) => c.CreditIpgErrorEmptyDataComponent,
          ),
      },
      {
        path: 'final-contract/:fundProviderCode/:creditId',
        loadComponent: () =>
          retryImport(() => import('./credit-wallet-detail/credit-final-contract-page/credit-final-contract-page.component')).then(
            (c) => c.CreditFinalContractPageComponent,
          ),
      },
      {
        path: 'pre-register',
        // this route is temporarily changed for internal testing
        loadChildren: () => retryImport(() => import('./pre-registration/pre-registration.routes')).then((m) => m.preRegistrationRoutes),
      },
      {
        path: 'select-plan',
        loadChildren: () => retryImport(() => import('./pre-registration/pre-registration.routes')).then((m) => m.preRegistrationRoutes),
      },
      // this route is temporarily commented
      // {
      //   path: 'smart-score',
      //   loadChildren: () =>
      //     retryImport(() => import('./credit-smart-scoring/credit-smart-scoring-step.module')).then((c) => c.CreditSmartScoringStepModule),
      //   data: { preload: true, critical: true },
      // },
      // this route is temporarily commented
      {
        path: 'wallet/activation/subscription',
        loadChildren: () =>
          retryImport(() => import('./wallet-activation/credit-subscription/credit-subscription.module')).then(
            (m) => m.CreditSubscriptionModule,
          ),
      },
      {
        // Installment-Pay-Link (which is known as 'Pay By Link' in the backend)
        // We have something like this in credit purchase
        path: 'ipl',
        loadChildren: () => retryImport(() => import('./installment-pay-link')).then((r) => r.IplRoutes),
      },
      {
        path: '',
        redirectTo: 'resolve',
        pathMatch: 'full',
      },
    ],
    data: { preload: true, critical: true },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditRoutingModule {}
