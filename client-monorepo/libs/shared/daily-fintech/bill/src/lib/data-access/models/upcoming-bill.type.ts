import { BillTypeEnum, TermType } from './bill-types.enum';

export type Bill = {
  type: 2;
  amount: number;
  feeCharge: number;
  name: string;
  payExpirationDate?: string;
  imageId: string;
  billId: string;
  payId: string;
  billType: BillTypeEnum;
  colorRange: number[];
  hintDto?: {
    title: string;
    description: string;
  };
  termType: TermType;
};

export type BillPayment = {
  paymentType: number;
  payload: {
    billInfo: Bill;
  };
};
