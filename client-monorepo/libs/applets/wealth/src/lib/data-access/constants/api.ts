export const LOGIN_API = '/v2/user/login';
export const USER_API = '/v2/user';
export const BINDING_STATUS_API = '/binding/status';
export const BINDING_SEJAM_OTP_API = '/binding/sejamOtp';
export const BIND_AND_FETCH_API = '/binding/bindAndFetch';
export const NEXT_API = '/info/next';
export const REMAINS_API = '/customer/remains';
export const INFO_API = '/fund/info';
export const ONLINE_API = '/info/online';
export const PURCHASE_API = '/v2/request/purchase';
export const SELL_API = '/request/sell';
export const PROFIT_API = '/customer/profit';
export const CUSTOMER_INFO_API = '/customer/info';
export const ORDERS_API = '/customer/orders';
export const NEWS_API = '/v1/news/latest';
export const THIRD_PARTY_API = '/digipay/api/marketplace/third-party';
export const LEAD_API = '/v1/lead/collect';
export const CALCULATE_ALL_FUNDS_API = '/v1/fund/calculate-all-funds-efficiencies';
export const GET_ARMAN_FUNDS_ONLINE_API = '/v1/customer/online-portfolio';
export const GET_ARMAN_FUNDS_OFFLINE_API = '/v1/customer/offline-portfolio';
export const GET_PROFILE_API = '/v1/customer/get-profile';
export const UPDATE_SEJAMI_PROFILE_API = '/v1/customer/update-sejami-profile';
export const VERIFY_USER_API = '/v1/customer/verify-user';
export const REGISTER_CUSTOMER_OTP_API = '/v1/mutual-fund/register-customer-otp'; // TODO: DELETE
export const REGISTER_CUSTOMER_API = '/v1/fund/register-customer';
export const VERIFY_SEJAMI_API = '/v1/mutual-fund/verify-sejami'; // TODO: DELETE
export const VERIFY_PORTFOLIO_API = '/v1/mutual-fund/verify-portfolio'; // TODO: DELETE
export const VERIFY_SHAHKAR_API = '/v1/customer/verify-shahkar';
export const CREATE_BUY_ORDER_API = '/v1/mutual-fund/order/create-buy-order'; // TODO: DELETE
export const SELL_OTP_API = '/v1/mutual-fund/order/sell-otp'; // TODO: DELETE
export const CREATE_SELL_ORDER_API = '/v1/fund/order/create-sell-order';
export const CREATE_PAYMENT_API = '/v1/fund/order/create-buy-payment';
export const CALLBACK_PAYMENT_API = '/v1/fund/order/callback-payment';
export const GET_CUSTOMER_ORDERS_API = '/v1/mutual-fund/order/get-customer-orders'; // TODO: DELETE
export const GET_CUSTOMER_RECENT_ORDERS_API = '/v1/mutual-fund/order/get-customer-recent-orders'; // TODO: DELETE
export const GET_PHONE_NUMBER_API = '/v1/customer/digipay-registered-phone-number';
export const VERIFY_FARABI_CUSTOMER_API = '/v1/customer/verify-farabi-customer';
export const GET_ALL_ORDERS_API = '/v2/transaction/customer/get-all';
export const GET_RECENT_ORDERS_API = '/v1/transaction/customer/get-recent';
export const INSTRUMENT_OFFTIME_API = '/v1/instrument/is-available';
export const GET_ORDER_DETAILS_API = '/v2/transaction/customer/get-details';
export const SELLABLE_UNITS_API = '/v1/fund/saleable-units';
export const IS_HYBRID_API = '/v1/order/is-hybrid';
export const PAYMENT_CLIENT_METADATA_API = '/v1/order/payment-client-metadata';
export const REGISTER_API = '/v1/identity/register';
export const WEALTH_LOGIN_API = '/v1/identity/login';
export const WEALTH_LOGIN_DGP_API = '/v1/identity/login/dgp';
export const CONFIRM_PHONE_NUMBER_API = '/v1/identity/confirm-phone-number';
export const CONFIRM_NATIONAL_ID_API = '/v1/identity/confirm-national-id';
export const ADD_PASSWORD_API = '/v1/identity/add-password';
export const FORGET_PASSWORD_API = '/v1/identity/forget-password';
export const FORGOT_PASSWORD_API = '/v1/identity/forgot-password';
export const FORGET_PASSWORD_CONFIRM_2FA_API = '/v1/identity/forgot-password/confirm-2fa';
export const RESET_PASSWORD_API = '/v1/identity/reset-password';
export const REVOKE_API = '/v1/identity/revoke';
export const SESSIONS_API = '/v1/identity/sessions';
export const SESSION_HEALTH_API = '/v1/identity/session-health';
export const REFRESH_TOKEN_API = '/v1/identity/refresh';
export const VERIFY_FARABI_CUSTOMER = '/v1/customer/verify-farabi-customer';
export const IS_HYBRID = '/v1/order/is-hybrid';
export const ONLINE_NAV_API = '/v1/mutual-fund/online-nav';
export const CHANGE_PASSWORD_API = '/v1/identity/change-password';
export const CHANGE_EXPIRE_PASSWORD_API = '/v1/identity/change-expired-password';
export const FUND_GET_PROFILE_API = '/v1/fund/get-profile';
export const FUND_GET_ALL_FUND_PROFILES_API = '/v1/fund/get-all-funds';
export const FUND_GET_CHART_API = '/v1/fund/get-chart';
export const CHECK_USER_REGISTERED_IN_WEBSITE_API = '/v1/customer/check-user-registered-in-website';
export const IS_USER_COMPLETELY_REGISTERED = '/v1/identity/is-user-completely-registered';
export const VERIFY_CUSTOMER_STATE = '/v1/fund/verify-customer';
export const AGREEMENT_CUSTOMER = '/v1/fund/agreement-customer';
export const AGREEMENT_FILE = '/v1/fund/agreement-customer-file';
export const GET_SEJAMI_PROFILE = '/v1/customer/get-sejami-profile';
export const WALLET_BALANCE = '/v1/fund/etf/wallet-balance';
export const WALLET_CASHOUT = '/v1/fund/etf/wallet-cashout';
export const CASHIN_API = '/v1/cash-in/pay';
export const CROWD_FUNDING_LIST = '/v1/crowd-fund/projects';
export const CROWD_FUNDING_DETAILT = '/v1/crowd-fund/project-details';
export const CROWD_FUNDING_PROFILE = '/v1/crowd-fund/get-profile';
export const VERIFY_CUSTOMER_CROWD_STATE = '/v1/crowd-fund/verify-customer';
export const CREATE_CROWD_ORDER = '/v1/crowd-fund/order/create-order';
export const CREATE_CROWD_PAYMENT_API = '/v1/crowd-fund/pay/create-payment';
export const CALLBACK_CROWD_PAYMENT_API = '/v1/crowd-fund/pay/callback-payment';
export const CALLBACK_CASHIN_PAYMENT_API = '/v1/cash-in/callback';
export const REGISTER_CUSTOMER_CROWD_API = '/v1/crowd-fund/register-customer'; // Todo Remove
export const GET_DPX_USER_ID_API = '/users/profile';
export const NOTIFY_ME_INFORM_API = '/v1/notify-me/inform';
export const NOTIFY_ME_HAS_INFORM_API = '/v1/notify-me/has-inform';
export const CONFIRM_SEJAMI_API = '/v1/identity/confirm-sejami';
export const GET_IPO_PROFILE_API = '/v1/ipo/profile/';
export const GET_IPO_AGREEMENTS_API = '/agreement';
export const REMOVE_IPO_ORDER_API = '/v1/ipo/order/';
export const CANCEL_IPO_ORDER_API = '/cancel';
export const GET_IPO_LANDING_BANNER_API = '/v1/ipo/landing/banner';
export const UPDATE_SEJAM_API = '/v1/fund/update-customer-sejam';
export const FUND_SEJAMI_PROFILE_API = '/v1/customer/fund-sejami-profile';
export const VERIFY_CUSTOMER_UPDATE_SEJAM_API = '/v1/fund/verify-customer-update-sejam';
export const STOCK_LIST_API = '/v1/stock';
export const STOCK_PROFILE_API = '/v1/stock/profile';
export const STOCK_CHART_API = '/v1/stock/chart';
export const ONBOARD_API = '/v1/customer/onboard';
export const CAMPAIGN_BANNER_API = '/v1/campaign/launch';
export const CAMPAIGN_PROCESS_API = '/v1/coordinator/campaign/process';
export const COLLATERAL_LAUNCH_API = '/v1/coordinator/collateral/launch';
export const COLLATERAL_PROCESS_API = '/v1/coordinator/collateral/process';
export const WALLET_BALANCE_API = '/v1/wallet/balance';
export const WALLET_ETF_INFO_API = '/v1/wallet/etf/info';
export const WALLET_DETAIL_API = '/v1/wallet';
export const WALLET_DEPOSIT_PROCESS_API = '/v1/coordinator/wallet-deposit/process';
export const WALLET_CACH_IN_API = '/v1/wallet/cash-in';
export const WALLET_CACH_IN_INQUIRY_API = '/v1/wallet/cash-in/inquiry';
export const WALLET_CACH_OUT_INQUIRY_API = '/v1/wallet/cash-out/inquiry';
export const WALLET_WITHDROW_PROCESS_API = '/v1/coordinator/wallet-withdraw/process';
export const WALLET_BNPL_PROCESS_API = '/v1/coordinator/wallet-bnpl/process';
export const WALLET_BNPL_CLOSE_API = '/bnpl/close';
export const WALLET_BASE_API = '/v1/wallet';
export const CUSTOMER_PORTFOLIO_API = '/v1/customer/portfolio';
export const WALLET_COORDINATOR_PROCESS_API = '/v1/coordinator/wallet-bnpl-deposit/process';

export const PORTFOLIOS_HEAD_UP_API = '/v1/customer/portfolios/headup';
export const CUSTOMER_PORTFOLIOS_BY_SYMBOL_API = '/v1/customer/portfolios';
export const CUSTOMER_PORTFOLIOS_API = '/v1/customer/portfolios';

export const WALLET_AFFILIATE_CODE_API = '/affiliate-code';

const API_VERSION = {
  transactions: 'v1',
  customer: 'v1',
  fund: 'v1',
  user: 'v1',
  wallet: 'v1',
  profit: 'v1',
};

export const API = {
  transactions: {
    base: `/${API_VERSION.transactions}/transactions`,
  },
  customer: {
    base: `/${API_VERSION.customer}/customer`,
    verifyPostacCode: `/${API_VERSION.customer}/customer/verify-postal-code`,
  },
  fund: {
    checkout: `/${API_VERSION.fund}/fund/order/checkout`,
    createBuyOrder: `/${API_VERSION.fund}/fund/order/create-buy-order`,
  },
  user: {
    activities: `${API_VERSION.user}/user/activities`,
  },
  wallet: {
    base: `/${API_VERSION.wallet}/wallet`,
    coordinator: {
      swap: `/${API_VERSION.wallet}/coordinator/wallet-swap/process`,
      walletActivation: `/${API_VERSION.wallet}/coordinator/wallet-activation/process`,
    },
    activate: `/${API_VERSION.wallet}/wallet/activate`,
  },
  profit: {
    base: `/reports/${API_VERSION.profit}/profits/Wallet_Fx/Monthly`,
  },
};
