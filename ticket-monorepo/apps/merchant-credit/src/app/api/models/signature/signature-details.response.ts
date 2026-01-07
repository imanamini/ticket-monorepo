export interface SignatureDetailsResponse {
  signature: {
    signatureImageId: string;
    expirationDate: string;
    expirationDateTime: number;
  }
  hint: {
    title: string;
    description: string;
    imageId: string;
  }
  signedDocuments: SignedDocument[],
  pendingDocuments: SignedDocument[],
}

export interface SignedDocument {
  title: string;
  iconId: string;
  dateIconId: string;
  trackingCode: string;
  creationDate: string;
  creationDateTime: number;
  fileName: string;
}
