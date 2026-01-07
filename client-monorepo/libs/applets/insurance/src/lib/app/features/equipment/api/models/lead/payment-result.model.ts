export interface PaymentResultModel {
  paymentSuccess: boolean;
  amount: string;
  endPolicyDate: string;
  invoicePdfUrl: string;
  payDate: string;
  policyNumber: string;
  policyPdfUrl: string;
  productName: string;
  trackingCode: string;
  leadCode: string;
  userName: string;
  tillEnd: string;
  description: string;
  deadlineDays: number;
}
