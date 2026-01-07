export interface TransactionInterface {
  type: number;
  uid: string;
  status: number;
  name?: string;
  mainTitle?: string;
  secondaryTitle?: string;
  amount?: number;
  appTransaction?: boolean;
  creationDate?: number;
  exerciseDate?: number;
  description?: string;
  feeCharge?: number;
  imageId?: string;
  ownerSide?: number;
  trackingCode?: string;
}
