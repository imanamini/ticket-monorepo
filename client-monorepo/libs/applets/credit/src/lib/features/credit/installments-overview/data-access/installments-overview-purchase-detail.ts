export interface InstallmentsOverviewPurchaseDetail {
  trackingCode: string;
  businessImageId: string;
  businessName: string;
  purchaseDate: string;
  purchaseTitle: string;
  purchaseValue: string;
  refunds: Refund[];
}

interface Refund {
  title: string;
  value: string;
}
