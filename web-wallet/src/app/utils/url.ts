import { environment } from '../../environments/environment';
import { PAYMENT_TYPES } from '../core/constants';
import { Base64 } from 'js-base64';
import { activityInfoTransformer } from '../api/transformer/activity-info.transformer';
import { PaymentResult } from '../api/models/payment-result.response';

/**
 * Used for generating callback URLS
 * for different services.
 *
 * User will be redirected to this URLs after
 * visiting the payment gateway
 *
 */
const paymentCallbackUrl = (type: string, payTicket: string) => {
  const HOST = window.location.origin + environment.route_prefix;
  switch (type) {
    case PAYMENT_TYPES.CASH_IN:
      return HOST + '/payment/result/' + payTicket;
    case PAYMENT_TYPES.PURCHASE_CASH_IN:
      return HOST + '/pay/' + payTicket;
    case PAYMENT_TYPES.SUBSCRIPTION_CASH_IN:
      return HOST + '/subscription/' + payTicket;
    default:
      return '';
  }
};

/**
 * Returns true when URL is a URL scheme (for andorid/ios apps)
 */
const isApplicationUrl = (url) => {
  return !(new RegExp(/^https?/)).test(url);
};

/**
 * Reads the payment data from the URL
 */
const readPaymentDataFromUrl = (): Promise<PaymentResult> => {
  const searchParams = new URLSearchParams(window.location.search);
  return new Promise((resolve, reject) => {
    let data = searchParams.get('data');
    if (data) {
      data = decodeURIComponent(data);
      // javascript normal decode (atob function)
      // did'nt work for this string and we should
      // use this third-party tool for doing this
      const decodedData = JSON.parse(Base64.decode(data));
      if (decodedData.payInfo) {
        decodedData.payInfo = JSON.parse(decodedData.payInfo);
      }
      if (decodedData.activityInfo) {
        decodedData.activityInfo = activityInfoTransformer(decodedData.activityInfo);
      }
      resolve(decodedData);
    } else {
      reject(null);
    }
  });
};

export {
  paymentCallbackUrl,
  isApplicationUrl,
  readPaymentDataFromUrl,
};
