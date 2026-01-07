import { Routes } from '@angular/router';
import {
  ALLPROFILES,
  AMLAK_PROVIDER_UNAVAILIBLE_ROUTE,
  CAMPAIGN_AGREEMENT_ROUTE,
  CAMPAIGN_OTP_ROUTE,
  CAMPAIGN_SHAHKAR_ERROR_ROUTE,
  CASHIN_ROUTE,
  CASHOUT_ROUTE,
  CHANGE_PHONE_NUMBER_ROUTE,
  CHOICE_PAYMENT_METHOD_ROUTE,
  COLLATERAL_APPROVED_ROUTE,
  COLLATERAL_REJECTED_ROUTE,
  COLLATERAL_ROUTE,
  COLLATERAL_WAITING_ROUTE,
  CONFIRM_COLLATERAL_INFO_ROUTE,
  CREATE_PASSWORD_ROUTE,
  CROWD_LIST_ROUTE,
  CUSTOMER_DEATH_ROUTE,
  EXPIRED_NOTICE_ROUTE,
  EXPIRED_PASSWORD_ROUTE,
  EXPIRED_SESSION_NOTICE_ROUTE,
  FAQ,
  FORGET_PASSWORD_ROUTE,
  GENERAL_ERROR_ROUTE,
  HOME_ROUTE,
  HOME_TAB_ROUTE,
  INVESTMENT_LIST_ROUTE,
  IPG_CALLBACK_ROUTE,
  IPO_ROUTE,
  LOGIN_ROUTE,
  NATIONAL_ID_ERROR_ROUTE,
  NATIONAL_ID_ROUTE,
  News,
  OFF_TIME_ERROR_ROUTE,
  OTP_ROUTE,
  PAYMENT_METHOD_CONDITIONS_ROUTE,
  PENDING_TRANSACTIONS_ROUTE,
  PORTFO,
  POSTAL_CODE_REGISTRATION_ROUTE,
  PRICES,
  PROFILE_ROUTE,
  PROSPECTUS_ROUTE,
  PROVIDER_CAPACITY_FULL_ROUTE,
  PROVIDER_NOT_AVAILABLE_ROUTE,
  PURCHASE_ROUTE,
  RECEIPT_ROUTE,
  REGISTER_ROUTE,
  RESULT_ROUTE,
  SEJAM_CHECK_ROUTE,
  SEJAM_ERROR_ROUTE,
  SEJAM_NATIONAL_ID_ROUTE,
  SEJAM_SUCCESS_ROUTE,
  SELECT_BANK_ACCOUNT_ROUTE,
  SELL_DETAIL_ROUTE,
  SELL_OTP_ROUTE,
  SELL_ROUTE,
  SELL_STOCK_ROUTE,
  SIGN_AGREEMENTS_ROUTE,
  TERMS_AND_CONDITIONS_ROUTE,
  TRANSACTIONS_ROUTE,
  TREASURE_HUNT_CAPACITY_FULL_ROUTE,
  TREASURE_HUNT_NATIONAL_ID_ROUTE,
  TREASURE_HUNT_REGISTRATION_SUCCESSFUL_ROUTE,
  TREASURE_HUNT_START_ROUTE,
  TREASURE_HUNT_SUCCESSFUL_ROUTE,
  UNAUTHORIZED_ROUTE,
  USER_EXIST_WITH_ANOTHER_PHONE_NUMBER_ROUTE,
  USER_LOGIN_ACTIVITIES_ROUTE,
  WALLET_ANNUAL_PROFIT_ROUTE,
  WALLET_BNPL_DETAIL_ROUTE,
  WALLET_BNPL_PAYMENT_DETAIL_ROUTE,
  WALLET_BNPL_REQUEST_FAILURE_ROUTE,
  WALLET_BNPL_REQUEST_ROUTE,
  WALLET_BNPL_ROUTE,
  WALLET_CASH_IN_INDISTINCTIVE_ROUTE,
  WALLET_CASH_IN_ROUTE,
  WALLET_CASH_OUT_ROUTE,
  WALLET_CUTOFF_ROUTE,
  WALLET_DEBT_NOTICE_ROUTE,
  WALLET_FX_WITHDRAW_CONFIRMATION,
  WALLET_FX_DEPOSIT,
  WALLET_FX_WITHDRAW,
  WALLET_GOLD_DEPOSIT,
  WALLET_GOLD_WITHDRAW,
  WALLET_GUIDS,
  WALLET_IBAN_ROUTE,
  WALLETS_ROUTE,
  WALLET_GOLD_WITHDRAW_CONFIRMATION,
  WALLET_WITHDRAW_GOLD_PENDING,
  WALLET_FX_BNPL,
  WALLET_BNPL_CONFIRMATION,
  WALLET_GOLD_BNPL,
  WALLET_MIX_BNPL,
  WALLET_BNPL_RECHARGE,
  SWAP_LANDING,
  SWAP_CONFIRM,
  SWAP_RESULT,
  QUICK_PAYMENT,
  WALLET_ACTIVATION_RESULT,
} from './data-access/constants/app-routes';
import { LoginComponent } from './features/makna-authentication/containers/login/login.component';
import { AuthenticationGuard } from './components/core/guards/authentication.guard';
import { StagingGuard } from './components/core/guards/staging.guard';
import { LandingPageGuard } from './components/core/guards/landing-page.guard';
import { PaymentProxyService } from './shared/services/payment/payment-proxy.service';
import { FundsPaymentService } from './shared/services/payment/implements/funds-payment.service';
import { OrderService } from './shared/services/payment/order.service';
import { providePayment } from './shared/services/payment/providers/payment.providers';

export const wealthRoutes: Routes = [
  {
    path: REGISTER_ROUTE,
    loadComponent: () => import('./features/makna-authentication/containers/register/register.component').then((c) => c.RegisterComponent),
  },
  {
    path: LOGIN_ROUTE,
    component: LoginComponent,
  },
  {
    path: FORGET_PASSWORD_ROUTE,
    loadComponent: () =>
      import('./features/makna-authentication/containers/forget-password/forget-password.component').then((c) => c.ForgetPasswordComponent),
  },
  {
    path: CHANGE_PHONE_NUMBER_ROUTE,
    loadComponent: () =>
      import('./features/makna-authentication/containers/change-phone-number/change-phone-number.component').then(
        (c) => c.ChangePhoneNumberComponent,
      ),
  },
  {
    path: EXPIRED_NOTICE_ROUTE,
    loadComponent: () =>
      import('./features/makna-authentication/containers/expired-notice/expired-notice.component').then((c) => c.ExpiredNoticeComponent),
  },
  {
    path: EXPIRED_PASSWORD_ROUTE,
    loadComponent: () =>
      import('./features/makna-authentication/containers/expired-password/expired-password.component').then(
        (c) => c.ExpiredPasswordComponent,
      ),
  },
  {
    path: EXPIRED_SESSION_NOTICE_ROUTE,
    loadComponent: () =>
      import('./features/makna-authentication/containers/session-expired-notice/session-expired-notice.component').then(
        (c) => c.SessionExpiredNoticeComponent,
      ),
  },
  {
    path: IPG_CALLBACK_ROUTE,
    loadComponent: () => import('./features/purchase/containers/ipg-callback/ipg-callback.component').then((c) => c.IpgCallbackComponent),
  },
  {
    path: '',
    canActivate: [LandingPageGuard],
    loadComponent: () => import('./features/landing/containers/landing/landing.component').then((c) => c.LandingComponent),
  },
  {
    path: '',
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: PURCHASE_ROUTE,
        providers: [PaymentProxyService, OrderService, ...providePayment('fund', FundsPaymentService)],
        children: [
          {
            path: ':id',
            loadComponent: () => import('./features/purchase/containers/purchase/purchase.component').then((c) => c.PurchaseComponent),
          },
        ],
      },
      {
        path: SIGN_AGREEMENTS_ROUTE,
        loadComponent: () =>
          import('./features/purchase/containers/sign-agreement/sign-agreements.component').then((c) => c.SignAgreementsComponent),
      },
      {
        path: SELL_ROUTE,
        children: [
          {
            path: ':id',
            loadComponent: () => import('./features/purchase/containers/sell/sell.component').then((c) => c.SellComponent),
          },
        ],
      },
      {
        path: TRANSACTIONS_ROUTE,
        loadComponent: () =>
          import('./features/transaction/containers/transactions/transactions.component').then((c) => c.TransactionsComponent),
        data: { title: 'تراکنش‌ها' },
      },
      {
        path: PENDING_TRANSACTIONS_ROUTE,
        loadComponent: () =>
          import('./features/transaction/containers/pending-transactions/pending-transactions.component').then(
            (c) => c.PendingTransactionsComponent,
          ),
        data: { title: 'تراکنش‌ها' },
      },
      {
        path: TREASURE_HUNT_START_ROUTE,
        loadComponent: () =>
          import('./features/campaign/pages/campaign-start/campaign-start.component').then((c) => c.CampaignStartComponent),
      },
      {
        path: TREASURE_HUNT_CAPACITY_FULL_ROUTE,
        loadComponent: () =>
          import('./features/campaign/pages/campaign-capacity-full/campaign-capacity-full.component').then(
            (c) => c.CampaignCapacityFullComponent,
          ),
      },
      {
        path: TREASURE_HUNT_REGISTRATION_SUCCESSFUL_ROUTE,
        loadComponent: () =>
          import('./features/campaign/pages/campaign-registration-successful/campaign-registration-successful.component').then(
            (c) => c.CampaignRegistrationSuccessfulComponent,
          ),
      },
      {
        path: TREASURE_HUNT_SUCCESSFUL_ROUTE,
        loadComponent: () =>
          import('./features/campaign/pages/campaign-successful/campaign-successful.component').then((c) => c.CampaignSuccessfulComponent),
      },
      {
        path: TREASURE_HUNT_NATIONAL_ID_ROUTE,
        loadComponent: () =>
          import('./features/campaign/pages/campaign-national-id/campaign-national-id.component').then(
            (c) => c.CampaignNationalIdComponent,
          ),
      },
      {
        path: CAMPAIGN_OTP_ROUTE,
        loadComponent: () => import('./features/campaign/pages/campaign-otp/campaign-otp.component').then((c) => c.CampaignOtpComponent),
      },
      {
        path: CAMPAIGN_AGREEMENT_ROUTE,
        loadComponent: () =>
          import('./features/campaign/pages/campaign-agreements/campaign-agreements.component').then((c) => c.CampaignAgreementsComponent),
      },
      {
        path: CAMPAIGN_SHAHKAR_ERROR_ROUTE,
        loadComponent: () =>
          import('./features/campaign/pages/campaign-shahkar-error/campaign-shahkar-error.component').then(
            (c) => c.CampaignShahkarErrorComponent,
          ),
      },
      {
        path: SEJAM_ERROR_ROUTE,
        loadComponent: () => import('./shared/containers/sejam-error/sejam-error.component').then((c) => c.SejamErrorComponent),
      },
      {
        path: NATIONAL_ID_ERROR_ROUTE,
        loadComponent: () =>
          import('./shared/containers/national-id-error/national-id-error.component').then((c) => c.NationalIdErrorComponent),
      },
      {
        path: SEJAM_CHECK_ROUTE,
        loadComponent: () =>
          import('./features/sejam-check/containers/sejam-check/sejam-check.component').then((c) => c.SejamCheckComponent),
      },
      {
        path: OTP_ROUTE,
        loadComponent: () => import('./features/purchase/containers/otp/otp.component').then((c) => c.OtpComponent),
      },
      {
        path: NATIONAL_ID_ROUTE,
        loadComponent: () => import('./features/purchase/containers/national-id/national-id.component').then((c) => c.NationalIdComponent),
      },
      {
        path: SELL_DETAIL_ROUTE,
        loadComponent: () => import('./features/purchase/containers/sell-detail/sell-detail.component').then((c) => c.SellDetailComponent),
      },
      {
        path: PROSPECTUS_ROUTE,
        loadComponent: () => import('./features/purchase/containers/prospectus/prospectus.component').then((c) => c.ProspectusComponent),
      },
      {
        path: RESULT_ROUTE,
        loadComponent: () =>
          import('./shared/containers/operation-result/operation-result.component').then((c) => c.OperationResultComponent),
      },
      {
        path: SELL_OTP_ROUTE,
        loadComponent: () => import('./features/purchase/containers/sell-otp/sell-otp.component').then((c) => c.SellOtpComponent),
      },
      {
        path: PROVIDER_NOT_AVAILABLE_ROUTE,
        loadComponent: () =>
          import('./shared/containers/provider-not-available/provider-not-available.component').then(
            (c) => c.ProviderNotAvailableComponent,
          ),
      },
      {
        path: PROVIDER_CAPACITY_FULL_ROUTE,
        loadComponent: () =>
          import('./shared/containers/provider-capacity-full/provider-capacity-full.component').then(
            (c) => c.ProviderCapacityFullComponent,
          ),
      },
      {
        path: OFF_TIME_ERROR_ROUTE,
        loadComponent: () => import('./shared/containers/off-time-error/off-time-error.component').then((c) => c.OffTimeErrorComponent),
      },
      {
        path: GENERAL_ERROR_ROUTE,
        loadComponent: () => import('./shared/containers/general-errors/general-errors.component').then((c) => c.GeneralErrorsComponent),
      },
      {
        path: RECEIPT_ROUTE,
        loadComponent: () => import('./shared/containers/receipt/receipt.component').then((c) => c.ReceiptComponent),
      },
      {
        path: PROFILE_ROUTE,
        loadComponent: () => import('./features/user-profile/user-profile.component').then((c) => c.UserProfileComponent),
      },
      {
        path: UNAUTHORIZED_ROUTE,
        loadComponent: () => import('./shared/containers/unauthorized/unauthorized.component').then((c) => c.UnauthorizedComponent),
      },
      {
        path: USER_LOGIN_ACTIVITIES_ROUTE,
        loadComponent: () =>
          import('./features/user-login-activities/user-login-activities.component').then((c) => c.UserLoginActivitiesComponent),
      },
      {
        path: TERMS_AND_CONDITIONS_ROUTE,
        loadComponent: () =>
          import('./features/terms-and-conditions/terms-and-conditions.component').then((c) => c.TermsAndConditionsComponent),
      },
      {
        path: SEJAM_NATIONAL_ID_ROUTE,
        loadComponent: () =>
          import('./features/sejam-check/containers/sejam-national-id/sejam-national-id.component').then((c) => c.SejamNationalIdComponent),
      },
      {
        path: SEJAM_SUCCESS_ROUTE,
        loadComponent: () =>
          import('./features/sejam-check/containers/sejam-successful/sejam-successful.component').then((c) => c.SejamSuccessfulComponent),
      },
      {
        path: INVESTMENT_LIST_ROUTE,
        children: [
          {
            path: ':id',
            loadComponent: () => import('./features/funds/fund-profile/fund-profile.component').then((c) => c.FundProfileComponent),
          },
          {
            path: '',
            loadComponent: () => import('./features/funds/funds-list/funds-list.component').then((c) => c.FundsListComponent),
          },
        ],
      },
      {
        path: USER_EXIST_WITH_ANOTHER_PHONE_NUMBER_ROUTE,
        loadComponent: () =>
          import('./features/purchase/components/user-exist-with-another-phone-number/user-exist-with-another-phone-number.component').then(
            (c) => c.UserExistWithAnotherPhoneNumberComponent,
          ),
      },
      {
        path: COLLATERAL_ROUTE + '/:symbol',
        loadComponent: () => import('./features/collateral/collateral.component').then((c) => c.CollateralComponent),
      },
      {
        path: CONFIRM_COLLATERAL_INFO_ROUTE,
        loadComponent: () =>
          import('./features/collateral/containers/confirm-collateral-info/confirm-collateral-info.component').then(
            (c) => c.ConfirmCollateralInfoComponent,
          ),
      },
      {
        path: COLLATERAL_WAITING_ROUTE,
        loadComponent: () =>
          import('./features/collateral/containers/collateral-waiting-result/collateral-waiting-result.component').then(
            (c) => c.CollateralWaitingResultComponent,
          ),
      },
      {
        path: COLLATERAL_REJECTED_ROUTE,
        loadComponent: () =>
          import('./features/collateral/containers/collateral-rejected-result/collateral-rejected-result.component').then(
            (c) => c.CollateralRejectedResultComponent,
          ),
      },
      {
        path: COLLATERAL_APPROVED_ROUTE,
        loadComponent: () =>
          import('./features/collateral/containers/collateral-approved-result/collateral-approved-result.component').then(
            (c) => c.CollateralApprovedResultComponent,
          ),
      },
      {
        path: WALLETS_ROUTE,
        children: [
          {
            path: ':id',
            loadComponent: () => import('./features/wallet/wallet.component').then((c) => c.WalletComponent),
          },
        ],
      },
      {
        path: WALLET_CASH_IN_ROUTE + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/wallet-cash-in/wallet-cash-in.component').then((c) => c.WalletCashInComponent),
      },
      {
        path: WALLET_FX_DEPOSIT + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/deposit-to-fx-wallet/deposit-to-fx-wallet.component').then(
            (c) => c.DepositToFxWalletComponent,
          ),
      },
      {
        path: WALLET_GOLD_DEPOSIT + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/deposit-to-gold-wallet/deposit-to-gold-wallet.component').then(
            (c) => c.DepositToGoldWalletComponent,
          ),
      },
      {
        path: WALLET_FX_WITHDRAW + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/withdrow-from-fx-wallet/withdrow-from-fx-wallet.component').then(
            (c) => c.WithdrowFromFxWalletComponent,
          ),
      },
      {
        path: WALLET_FX_WITHDRAW_CONFIRMATION + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/withdrow-from-fx-wallet-confirmation/withdrow-from-fx-wallet-confirmation.component').then(
            (c) => c.WithdrowFromFxWalletConfirmationComponent,
          ),
      },
      {
        path: WALLET_GOLD_WITHDRAW + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/withdraw-from-gold-wallet/withdraw-from-gold-wallet.component').then(
            (c) => c.WithdrawFromGoldWalletComponent,
          ),
      },
      {
        path: WALLET_GOLD_WITHDRAW_CONFIRMATION + '/:id',
        loadComponent: () =>
          import(
            './features/wallet/containers/withdrow-from-gold-wallet-confirmation/withdrow-from-gold-wallet-confirmation.component'
          ).then((c) => c.WithdrowFromGoldWalletConfirmationComponent),
      },
      {
        path: WALLET_WITHDRAW_GOLD_PENDING + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/withdraw-from-gold-wallet-pending/withdraw-from-gold-wallet-pending.component').then(
            (c) => c.WithdrawFromGoldWalletPendingComponent,
          ),
      },
      {
        path: WALLET_FX_BNPL + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/bnpl-as-fx-wallet/bnpl-as-fx-wallet.component').then((c) => c.BnplAsFxWalletComponent),
      },
      {
        path: WALLET_GOLD_BNPL + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/bnpl-as-gold-wallet/bnpl-as-gold-wallet.component').then((c) => c.BnplAsGoldWalletComponent),
      },
      {
        path: WALLET_MIX_BNPL + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/bnpl-as-mix-wallets/bnpl-as-mix-wallets.component').then((c) => c.BnplAsMixWalletsComponent),
      },
      {
        path: WALLET_BNPL_RECHARGE + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/bnpl-recharge/bnpl-recharge.component').then((c) => c.BnplRechargeComponent),
      },
      {
        path: WALLET_BNPL_CONFIRMATION + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/bnpl-confirmation/bnpl-confirmation.component').then((c) => c.BnplConfirmationComponent),
      },
      {
        path: WALLET_CASH_OUT_ROUTE + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/wallet-cashout/wallet-cashout.component').then((c) => c.WalletCashoutComponent),
      },
      {
        path: WALLET_IBAN_ROUTE + '/:id',
        loadComponent: () => import('./features/wallet/containers/wallet-iban/wallet-iban.component').then((c) => c.WalletIbanComponent),
      },
      {
        path: WALLET_BNPL_ROUTE + '/:id',
        loadComponent: () => import('./features/wallet/containers/wallet-bnpl/wallet-bnpl.component').then((c) => c.WalletBnplComponent),
      },
      {
        path: WALLET_BNPL_DETAIL_ROUTE + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/wallet-bnpl-detail/wallet-bnpl-detail.component').then((c) => c.WalletBnplDetailComponent),
      },
      {
        path: WALLET_CUTOFF_ROUTE + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/wallet-cutoff/wallet-cutoff.component').then((c) => c.WalletCutoffComponent),
      },
      {
        path: WALLET_BNPL_REQUEST_ROUTE + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/wallet-bnpl-request/wallet-bnpl-request.component').then(
            (c) => c.WalletBnplRequestComponent,
          ),
      },
      {
        path: WALLET_BNPL_PAYMENT_DETAIL_ROUTE + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/wallet-bnpl-payment-detail/wallet-bnpl-payment-detail.component').then(
            (c) => c.WalletBnplPaymentDetailComponent,
          ),
      },
      {
        path: WALLET_BNPL_REQUEST_FAILURE_ROUTE + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/wallet-bnpl-request-failure/wallet-bnpl-request-failure.component').then(
            (c) => c.WalletBnplRequestFailureComponent,
          ),
      },
      {
        path: WALLET_GUIDS,
        children: [
          {
            path: 'profit-credit' + '/:id',
            loadComponent: () =>
              import('./features/wallet/containers/guides/profit-credit/profit-credit.component').then((c) => c.ProfitCreditComponent),
          },
          {
            path: 'gold-plan' + '/:id',
            loadComponent: () =>
              import('./features/wallet/containers/guides/gold-plan/gold-plan.component').then((c) => c.GoldPlanComponent),
          },
          {
            path: 'fixed-income' + '/:id',
            loadComponent: () =>
              import('./features/wallet/containers/guides/fixed-income/fixed-income.component').then((c) => c.FixedIncomeComponent),
          },
          {
            path: 'purchase-credit' + '/:id',
            loadComponent: () =>
              import('./features/wallet/containers/guides/purchase-credit/purchase-credit.component').then(
                (c) => c.PurchaseCreditComponent,
              ),
          },
          {
            path: 'campaign' + '/:id',
            loadComponent: () =>
              import('./features/wallet/containers/guides/motorcycle-campaign/motorcycle-campaign.component').then(
                (c) => c.MotorcycleCampaignComponent,
              ),
          },
        ],
      },
      {
        path: POSTAL_CODE_REGISTRATION_ROUTE + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/postal-code-registration/postal-code-registration.component').then(
            (c) => c.PostalCodeRegistrationComponent,
          ),
      },
      {
        path: AMLAK_PROVIDER_UNAVAILIBLE_ROUTE + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/amlak-provider-unavailible/amlak-provider-unavailible.component').then(
            (c) => c.AmlakProviderUnavailibleComponent,
          ),
      },
      {
        path: SELECT_BANK_ACCOUNT_ROUTE + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/select-bank-account/select-bank-account.component').then(
            (c) => c.SelectBankAccountComponent,
          ),
      },
      {
        path: CREATE_PASSWORD_ROUTE,
        loadComponent: () =>
          import('./features/makna-authentication/containers/add-password/add-password.component').then((c) => c.AddPasswordComponent),
      },
      {
        path: FAQ,
        loadComponent: () => import('./features/faq/faq.component').then((c) => c.FaqComponent),
      },
      {
        path: News,
        loadComponent: () => import('./features/news/containers/news/news.component').then((c) => c.NewsComponent),
      },
      {
        path: PRICES,
        loadComponent: () => import('./features/price/containers/prices/prices.component').then((c) => c.PricesComponent),
      },
      {
        path: PORTFO,
        loadComponent: () => import('./features/portfo/container/portfo/portfo.component').then((c) => c.PortfoComponent),
      },
      {
        path: ALLPROFILES,
        loadComponent: () =>
          import('./features/portfo/components/portfo-all-profiles/portfo-all-profiles.component').then(
            (c) => c.PortfoAllProfilesComponent,
          ),
      },
      {
        path: CASHOUT_ROUTE,
        loadComponent: () => import('./features/portfo/container/cash-out/cash-out.component').then((c) => c.CashOutComponent),
      },
      {
        path: CASHIN_ROUTE,
        loadComponent: () => import('./features/portfo/container/cash-in/cash-in.component').then((c) => c.CashInComponent),
      },
      {
        path: WALLET_CASH_IN_INDISTINCTIVE_ROUTE + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/wallet-cash-in-indistinctive/wallet-cash-in-indistinctive.component').then(
            (c) => c.WalletCashInIndistinctiveComponent,
          ),
      },
      {
        path: WALLET_DEBT_NOTICE_ROUTE + '/:id',
        loadComponent: () => import('./features/wallet/containers/debt-notice/debt-notice.component').then((c) => c.DebtNoticeComponent),
      },
      {
        path: WALLET_ANNUAL_PROFIT_ROUTE + '/:id',
        loadComponent: () =>
          import('./features/wallet/containers/wallet-annual-profit/wallet-annual-profit.component').then(
            (c) => c.WalletAnnualProfitComponent,
          ),
      },
      {
        path: WALLET_ACTIVATION_RESULT,
        loadComponent: () =>
          import('./features/swap/pages/activation-result/activation-result.component').then((c) => c.ActivationResultComponent),
      },
      {
        path: SWAP_LANDING + '/:id',
        loadComponent: () => import('./features/swap/swap-landing.component').then((c) => c.SwapLandingComponent),
      },
      {
        path: SWAP_CONFIRM + '/:id',
        loadComponent: () => import('./features/swap/pages/confirm-swap/confirm-swap.component').then((c) => c.ConfirmSwapComponent),
      },
      {
        path: SWAP_RESULT + '/:id',
        loadComponent: () => import('./features/swap/pages/swap-result/swap-result.component').then((c) => c.SwapResultComponent),
      },
      {
        path: CROWD_LIST_ROUTE,
        canActivateChild: [StagingGuard],
        children: [
          {
            path: ':id',
            loadComponent: () => import('./features/crowds/crowd-detail/crowd-detail.component').then((c) => c.CrowdDetailComponent),
          },
          {
            path: '',
            loadComponent: () => import('./features/crowds/crowd-list/crowd-list.component').then((c) => c.CrowdListComponent),
          },
        ],
      },
      {
        path: IPO_ROUTE + '/:id',
        loadComponent: () => import('./features/ipo/ipo.component').then((c) => c.IPOComponent),
      },
      {
        path: PAYMENT_METHOD_CONDITIONS_ROUTE + '/:symbol',
        loadComponent: () =>
          import('./features/choice-payment-way/components/payment-conditions/payment-conditions.component').then(
            (c) => c.PaymentConditionsComponent,
          ),
      },
      {
        path: CHOICE_PAYMENT_METHOD_ROUTE + '/:id',
        loadComponent: () => import('./features/choice-payment-way/choice-payment-way.component').then((c) => c.ChoicePaymentWayComponent),
      },
      {
        path: SELL_STOCK_ROUTE + '/:id',
        loadComponent: () => import('./features/sell-stock/sell-stock.component').then((c) => c.SellStockComponent),
      },
      {
        path: CUSTOMER_DEATH_ROUTE,
        loadComponent: () =>
          import('./features/sejam-check/containers/customer-death/customer-death.component').then((c) => c.CustomerDeathComponent),
      },
      {
        path: HOME_ROUTE,
        loadComponent: () => import('./features/home/home.component').then((c) => c.HomeComponent),
      },
      {
        path: HOME_TAB_ROUTE,
        loadComponent: () => import('./features/home/home.component').then((c) => c.HomeComponent),
      },
      {
        path: QUICK_PAYMENT + '/:id',
        loadComponent: () => import('./features/quick-payment/quick-payment.component').then((c) => c.QuickPaymentComponent),
      },
      {
        path: '**',
        redirectTo: HOME_ROUTE,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: HOME_ROUTE,
    pathMatch: 'full',
  },
];
