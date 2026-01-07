export interface BillInfoResponse {
  type: number;
  amount: number;
  feeCharge: number;
  name: string;
  creationDate: number;
  trackingCode: string;
  expirationDate: number;
  imageId: string;
  billType: number;
  billId: string;
  payId: string;
  colorRange: number[];
  termType: number;
  inquiryId: string; // * added by client;
  payUrl: string;
  hintDto: {
    description: string;
    title: string;
  };
  remarkDto: {
    imageId: string;
    backgroundColor: string;
    borderColor: string;
    text: string;
  };
}
