import { Store } from '@client-monorepo/stores';

export interface Voucher {
  code: string;
  description: string;
  expirationDate: number;
  store?: Store;
  storeTrackingCode: string;
  title: string;
  voucherId: string;
  type: VoucherType;
  value: string;
  image: string;
}

export enum VoucherType {
  PERCENTAGE = 0,
  AMOUNT = 1,
}
