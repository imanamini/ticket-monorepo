export enum APP_ACTIONS {
  /**
   * payment
   * PAYMENT_BPG_1PAY & PAYMENT_BPG_4PAY are hardcode in client side
   **/
  PAYMENT_WALLET = 0,
  PAYMENT_DPG = 1,
  PAYMENT_IPG = 2,
  PAYMENT_CPG = 3,
  PAYMENT_BPG = 4,
  PAYMENT_BPG_1PAY = 40,
  PAYMENT_BPG_4PAY = 41,
  PAYMENT_CAPG = 5,
  PAYMENT_ICP = 6,
  /**
   * settings
   **/
  SETTINGS = 50,
  SETTINGS_PASSWORD = 51,
  SETTINGS_REFERRAL = 52,
  SETTINGS_C2C_MANAGEMENT = 53,
  SETTINGS_TERMS = 54,
  SETTINGS_ABOUT_US = 55,
  SETTINGS_FEEDBACK = 56,
  SETTINGS_HELP = 57,
  SETTINGS_PROFILE = 58,
  SETTINGS_UPDATE = 59,
  SETTINGS_REMINDER = 60,
  SETTINGS_CASH_OUT = 61,
  SETTINGS_PRE_REGISTRATION = 62,
  SETTING_SESSIONS = 65,
  SETTINGS_WALLET_MANAGEMENT = 66,

  /**
   * login
   **/
  LOGIN_HOME = 100,

  /**
   * sdk
   **/
  SDK_INFO = 150,

  /**
   * navigation
   */
  NAV_HOME = 200,
  NAV_TRANSACTIONS = 201,
  NAV_BARCODE_READER = 202,
  NAV_FESTIVAL = 203,
  NAV_STORES = 204,

  /**
   * wallet
   */
  WALLET_ACTIVATION = 250,
  WALLET_CASH_IN = 251,
  WALLET_TRANSFER = 252,
  WALLET_CASH_IN_IPG = 253,
  WALLET_CASH_IN_DPG = 254,
  CASH_OUT = 255,
  /**
   * tac
   */
  TAC = 300,

  /**
   * feedback
   */
  FEEDBACK_MESSAGE = 350,

  /**
   * mini-apps
   */
  MINIAPP_BILL = 400,
  MINIAPP_CARD = 401,
  MINIAPP_TOPUP = 402,
  MINIAPP_INTERNET = 403,
  MINIAPP_MOBILE_BILL = 404,
  MINIAPP_TOLL = 405,
  MINIAPP_CONGESTION_PRICING = 407,
  MINIAPP_CREDIT = 408,
  MINIAPP_BNPL = 416,
  MINIAPP_NAMAK_ABRUD = 409,
  MINIAPP_CREDIT_SCORING = 410,
  MINIAPP_DONATION = 411,
  MINIAPP_TRAFFIC_FINE = 412,
  MiniApps_TAXI_PAY = 413,
  MINIAPP_VEHICLE_DEBT = 415,
  // MiniApps_Bimeh_Prsd = 551,  // todo check it
  MINIAPP_MARKETPLACE = 417,

  MORE_BUTTON = 499,

  /**
   * activities
   */
  ACTIVITIES = 500,

  /**
   * dynamic url and webview
   */
  URL = 550,
  WEBVIEW = 551,

  /**
   * festival
   */
  FESTIVAL = 600,

  /**
   * reminder
   */
  REMINDER_TOP_UP = 650,

  /**
   * For open url internally with token
   */
  OPEN_URL_WITH_TOKEN = 651,

  /**
   * c2c management
   */
  C2C_MANAGEMENT_NEW_CARD = 670,

  /**
   * home
   */
  HOME_CREDIT = 700,
  HOME_CARD = 701,
  HOME_WALLET = 702,
  HOME_BNPL = 703,

  /**
   * credit
   */
  CREDIT_ACTIVATION = 750,
  CREDIT_CONTRACT = 751,
  CREDIT_MAIN = 752,

  BNPL_ACTIVATION = 753,
  BNPL_CONTRACT = 754,
  BNPL_MAIN = 755,
}

export function codeToAppAction(code: string | number): string | null {
  if (typeof code === 'string') {
    code = parseInt(code, 10);
  }

  let found = null;
  Object.keys(APP_ACTIONS)
    .filter((key: any) => {
      return !isNaN(Number(APP_ACTIONS[key]));
    })
    .forEach((e: any) => {
      if (code === (APP_ACTIONS[e] as unknown)) {
        found = e;
      }
    });

  return found;
}
