export interface Merchant {
  creditId: string;
  fundProvider: string;
  status: MerchantStatus;
}

export enum MerchantStatus {
  PENDING,
  APPROVED,
  REJECTED,
  CANCELED
}
