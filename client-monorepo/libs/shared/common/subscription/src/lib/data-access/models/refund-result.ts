export interface RefundResult {
  status: REFUND_RESULT_STATUS;
  title: string;
  description: string;
  buttonText: string;
  image: 'success' | 'failed';
  isCap?: boolean;
}

export enum REFUND_RESULT_STATUS {
  SUCCESS,
  FAILED,
}
