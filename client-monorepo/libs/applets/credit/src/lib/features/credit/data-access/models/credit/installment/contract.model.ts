export interface Contract {
  trackingCode: string;
  count: number;
  paidCount: number;
  purchaseAmount: number;
  paidAmount: number;
  fundProviderName: string;
  fundProviderCode: number;
  startDate: number;
  endDate: number;
  endDateStr: string;
  startDateStr: string;
  status: number;
  messages: any[];
  imageId: string;
  overdueCount: number;
  prepayment: number;
  title: string;
  remainAmount: number;
  purchaseDate: number;
}
