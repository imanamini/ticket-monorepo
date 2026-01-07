export interface PurchaseDetailItem {
  trackingCode: string;
  businessImageId: string;
  businessName: string;
  purchaseDate: string;
  purchaseTitle: string;
  purchaseValue: string;
  refunds: Refund[];
}

interface Refund {
  iconId: string;
  title: string;
  value: string;
}
