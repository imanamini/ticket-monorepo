import { DigipayJsInterface } from '@digipay/ng-payment';

const DIGIPAY_GLOBAL_FUNCTIONS = {
  getToken(): void {
  },
  setAuthToken(token: string): void {
  },
  tokenExpired(): void {
  }
} as DigipayJsInterface;

export {
  DIGIPAY_GLOBAL_FUNCTIONS,
};

