export interface CardPaymentConfig {
  bankCode: string;
  trace?: string;
  pan: {
    expireDate: string;
    type: string;
    prefix: string;
    postfix: string;
    value: string;
  };
}
