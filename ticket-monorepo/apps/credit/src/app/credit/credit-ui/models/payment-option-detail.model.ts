export interface PaymentOptionDetail {
  sign: 'NEGATIVE' | 'POSITIVE';
  label: string;
  amount: number;
}
