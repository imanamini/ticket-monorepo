export interface PaymentResultModel {
  productName?: string;
  policyId?: null;
  policyNumber?: null;
  payDate?: number;
  endPolicyDate?: null;
  paymentSuccess?: boolean;
  trackingCode?: string;
  amount?: number;
  invoicePdfUrl?: null;
  policyPdfUrl?: null;
  leadCode?: null;
  uniqueCode?: string;
  userName?: null;
  tillEnd?: null;
  paymentGateWay?: string;
  deadlineDays?: number;
  referer?: string;
}
