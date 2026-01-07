import { ApiResultInterface } from "@client-monorepo/common/network";

export interface VoucherResponseInterface {
  result: ApiResultInterface;
  details: VoucherDetail[];
}

export interface VoucherDetail {
  serial: string;
  amount: number;
  balance: number;
  expirationDate: number;
  expired: boolean;
  restriction: {
    businessIds: string[];
  };
}
