export interface Installment {
  statusCode: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDING' | 'REFUNDED' | 'CANCELED' | 'UNPAYABLE' | 'PAY_IN_PROGRESS' | 'TODAY' | 'OVERDUE';
  order: number;
  date: string;
  installmentAmount: number;
  // the amount that user has received or payed (refund or installment pay)
  userAmount: number;
  id: any;
}

export enum InstallmentGroupOrder {
  Due,
  Unpaid,
  Paid,
}
