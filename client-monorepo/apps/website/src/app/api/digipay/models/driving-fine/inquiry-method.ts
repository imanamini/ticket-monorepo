export interface InquiryMethod {
  type: InquiryMethodType;
  title: string;
  description: string;
  hoverImageId: string;
  imageId: string;
}

export enum InquiryMethodType {
  GENERAL,
  DETAILED,
}
