export interface SignatureConfigResponse {
  step: SignatureStatus;
  tac: {
    imageId: string;
  };
  walkThroughModels: {
    imageId: string
  }[];
}

export enum SignatureStatus {
  INITIATION,
  REGISTRATION,
  SIGNATURE_GENERATION,
  FINALIZED
}
