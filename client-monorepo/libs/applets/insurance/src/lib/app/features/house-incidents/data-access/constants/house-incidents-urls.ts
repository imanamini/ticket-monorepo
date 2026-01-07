import { INSURANCE_APP_PREFIX } from '../../../../data-access/constants/insurance-app-prefix.constant';

export const HOUSE_INCIDENTS_BASE_URL = INSURANCE_APP_PREFIX + '/house-incidents';

export const HOUSE_INCIDENTS_URLS = {
  PLP: HOUSE_INCIDENTS_BASE_URL,
  COMPLETE_INFO: HOUSE_INCIDENTS_BASE_URL + '/complete-info',
  COMPLETE_JOURNEY: HOUSE_INCIDENTS_BASE_URL + '/complete-journey',
  PAYMENT_RESULT: HOUSE_INCIDENTS_BASE_URL + '/payment/result',
  PAYMENT_CHECK_HYBRID: HOUSE_INCIDENTS_BASE_URL + '/payment/check-hybrid',
  GO_TO_PAYMENT: HOUSE_INCIDENTS_BASE_URL + '/payment/go-to-payment',
  CHECKOUT: HOUSE_INCIDENTS_BASE_URL + '/checkout',
};
