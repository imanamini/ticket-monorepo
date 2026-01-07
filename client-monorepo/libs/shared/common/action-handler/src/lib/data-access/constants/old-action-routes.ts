import { APP_ACTIONS } from './app-actions';

export const URL_ACTION = 'OPEN_URL';

export const OLD_ACTION_ROUTES = {
  [APP_ACTIONS.URL]: URL_ACTION,
  // Wallet
  [APP_ACTIONS.WALLET_CASH_IN]: 'cash-in',
  [APP_ACTIONS.WALLET_TRANSFER]: 'wallet-transfer',

  // Settings
  [APP_ACTIONS.SETTINGS]: 'profile',
  [APP_ACTIONS.SETTINGS_REFERRAL]: 'profile/referral',
  [APP_ACTIONS.SETTINGS_C2C_MANAGEMENT]: 'profile/saved-cards',
  [APP_ACTIONS.C2C_MANAGEMENT_NEW_CARD]: 'profile/saved-cards/add/source',
  [APP_ACTIONS.SETTING_SESSIONS]: 'settings/sessions',

  // Pages
  [APP_ACTIONS.FESTIVAL]: 'pay-club',
  [APP_ACTIONS.NAV_FESTIVAL]: 'pay-club',
  [APP_ACTIONS.NAV_STORES]: 'stores',
  [APP_ACTIONS.NAV_BARCODE_READER]: 'qr',
  [APP_ACTIONS.NAV_TRANSACTIONS]: 'transactions',
  [APP_ACTIONS.ACTIVITIES]: 'transactions',
  [APP_ACTIONS.NAV_HOME]: '/hub',

  // Credit
  [APP_ACTIONS.MINIAPP_CREDIT]: 'credit/resolve',
  [APP_ACTIONS.CREDIT_ACTIVATION]: 'credit/wallet/activation/steps',
  [APP_ACTIONS.CREDIT_CONTRACT]: 'credit/wallet/detail',
  [APP_ACTIONS.CREDIT_MAIN]: 'service/credit/resolve',

  // BNPL
  [APP_ACTIONS.MINIAPP_BNPL]: 'bnpl/resolve',
  [APP_ACTIONS.BNPL_ACTIVATION]: 'bnpl/resolve',
  [APP_ACTIONS.BNPL_CONTRACT]: 'bnpl/wallet/detail',
  [APP_ACTIONS.BNPL_MAIN]: 'service/bnpl/resolve',

  // Mini-apps
  [APP_ACTIONS.MINIAPP_CONGESTION_PRICING]: 'congestion',
  [APP_ACTIONS.MINIAPP_CREDIT_SCORING]: 'credit-scoring',
  // [APP_ACTIONS.MINIAPP_DONATION]: getServicePath('ext', '/', '/view/donation'),
  [APP_ACTIONS.MINIAPP_DONATION]: 'donation',
  [APP_ACTIONS.WEBVIEW]: 'ext/view/webview',
  [APP_ACTIONS.MINIAPP_TRAFFIC_FINE]: 'fine',
  [APP_ACTIONS.MiniApps_TAXI_PAY]: 'qr',
  [APP_ACTIONS.MINIAPP_BILL]: 'bill',
  [APP_ACTIONS.MINIAPP_CARD]: 'service/c2c',
  [APP_ACTIONS.MINIAPP_TOPUP]: 'top-up',
  [APP_ACTIONS.MINIAPP_INTERNET]: 'internet',
  [APP_ACTIONS.MINIAPP_MOBILE_BILL]: 'bill/mobile', // todo check
  [APP_ACTIONS.MINIAPP_TOLL]: 'toll',
  [APP_ACTIONS.SETTINGS_CASH_OUT]: 'cash-out',
  [APP_ACTIONS.MINIAPP_VEHICLE_DEBT]: 'i-toll',
  [APP_ACTIONS.SETTINGS_WALLET_MANAGEMENT]: 'wallet-management',
};
