export interface CreditEnoteResult {
  imageId: string;
  description: string;
  title: string;
  pageTitle: string;
}

export type CreditEnoteStateType =
  | 'FORM'
  | 'IN_PROGRESS'
  | 'PAYMENT'
  | 'RESULT'
  | 'WAITING'
  | 'EXPIRED'
  | 'SANA_NOT_REGISTERED'
  | 'NO_SERVICE'
  | 'ENOTE_ERROR'
  | null
  | undefined;
