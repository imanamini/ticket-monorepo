export interface WalletCashOutByPanRegisterRequest {
  amount: number;
  nationalCode?: string;
  birthDate?: number;
  targetPan: {
    type: string | number;
    value: string;
    prefix: string;
    postfix: string;
    expireDate: string;
  };
  certFile?: string;
  type?: string;
}
