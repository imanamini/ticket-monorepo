export class STORAGE_KEY {
  // LocalStorage buckets and core keys
  static readonly DB_STORAGE = '__dp_storage';
  static readonly USER_ID_STORAGE_KEY = '__dp_userId';

  // Onboarding / session / routes
  static readonly DP_BEFORE_LOGIN_ROUTE = '__dp_before_login_route';
  static readonly DP_ONBOARDING_CHECKED = '__dp_onboarding_checked';
  static readonly DP_SESSION_ID = '__dp_session_id';

  // Redirects and callbacks
  static readonly REDIRECT_URL_AFTER_LOGIN = 'redirectUrlAfterLogin';
  static readonly CALLBACK_URL = '__callback_url';

  // Auth and tokens
  static readonly EXPIRED_TOKEN_VALUE = 'expired';

  // Native bridge / Hybrid app
  static readonly MARKET_NAME = 'app_market_name';

  // Feature flags and status
  static readonly HAS_BIOMETRIC = 'hasBiometric';
  static readonly ASSETS_HIDE_STATUS = 'assetIsHidden';

  // Search/history keys
  static readonly SEARCH_HISTORY = 'searchHistory';
  static readonly HUB_SEARCH_HISTORY = 'hubSearchHistory';

  // Time-based keys
  static readonly TIME_STAMP = 'timeStamp';
  static readonly REDIRECT_TIME_STAMP = 'redirectionTimestamp';
  static readonly LOCATION_TIME_STAMP = 'locationTimeStamp';
  static readonly UPDATE_TIME_STAMP = 'updateTimeStamp';
  static readonly LOCATION_EVENT_TIME = 'locationEvent';
  static readonly APP_MESSAGE_TIME_STAMP = 'appMessageTimeStamp';

  // Geolocation
  static readonly SET_LOCATION = 'isSetLocation';
  static readonly LAST_LOCATION = 'lastLocation';

  // UTM keys
  static readonly UTM_SOURCE = 'utm_source';
  static readonly UTM_MEDIUM = 'utm_medium';
  static readonly UTM_CAMPAIGN = 'utm_campaign';

  // Misc
  static readonly DB_TARGET = 'dp_target';
  static readonly IS_SET_PASSWORD = 'isSetPassword';

  // App message
  static readonly APP_MESSAGE_STORAGE_KEY = 'isCalledMessageApi';

  // Library specific storage buckets
  static readonly SUBSCRIPTION_STORAGE = '__subscription_storage';
  static readonly FORGET_PASSWORD_STORAGE = '__forget_password_storage';

  static readonly HUB_ONBOARDING = 'checkHubOnboarding';

  static readonly DIGIPAY_CARD_ONBOARDING_CHECKED = '__dp_card_onboarding_checked';

  static readonly VPN_CHECK_TIME_STAMP = 'vpnCheckTimeStamp';
}
