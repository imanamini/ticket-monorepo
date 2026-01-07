import { DigipayJsInterface } from '@digipay/ng-payment';

export interface AppWindow extends Window {
  digipay: DigipayJsInterface;
}
