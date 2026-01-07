import { OriginType } from '../core/models/check-origin.model';

export const wthOrigins = [
  'https://wealth.mydigipay.info',
  'https://wealth.mydigipay.ir',
];
export const dgpOrigins = [
  'https://uatapp.mydigipay.info',
  'https://app.mydigipay.com',

  'https://uatdpx.mydigipay.info',
  'https://dpx.mydigipay.com',
];
export const expressOrigins = [
  'https://express.mydigipay.info',
  'https://express.mydigipay.com',
];

/**
 *
 * @param origin
 * @returns if Origin is wealth or localhost return true
 */
export function checkWealthOrigin(): OriginType {
  if (wthOrigins.includes(window.location.origin)) {
    return 'wealth';
  } else if (dgpOrigins.includes(window.location.origin)) {
    return 'dgp';
  } else if (expressOrigins.includes(window.location.origin)) {
    return 'express';
  }
  return 'localhost';
}
