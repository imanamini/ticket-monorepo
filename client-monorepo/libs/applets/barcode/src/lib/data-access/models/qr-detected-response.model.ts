export interface QrDetectResponseModel {
  featureName: string;
  detail: QrDetectDetailResponseModel;
}

export interface QrDetectDetailResponseModel {
  className: string;
  terminalId?: string;
  institutionId?: string;
  trackingCode?: string;
  uniqueInvoiceNumber?: string;
  merchantUniqueId?: string;
}
