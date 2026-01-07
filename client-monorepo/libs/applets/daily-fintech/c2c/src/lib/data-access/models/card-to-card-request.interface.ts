export interface CardToCardRequest {
  // destCellNumber: string;
  source: {
    value: string;
    type: number;
    expireDate: string;
    prefix: string;
    postfix: string;
  };
  destination: {
    value: string;
    type: number;
    prefix: string;
    postfix: string;
  };
  encryptedPinDto: string;
  destFullName: string;
  amount: number;
  bankCode: string;
  certFile: string;
  saveDestination: boolean;
  saveSource: boolean;
  message: string;
  saveRecommendation: boolean;
  fingerprint?: string;
}
