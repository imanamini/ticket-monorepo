import { InquiryType } from './inquiry-type';

export interface FineLandingConfig {
  title: string;
  bannerImageId: string;
  campaignInfo: {
    title: string;
    type: number;
    isEnable: boolean;
  };
  tacInfo: {
    title: string;
    url: string;
    isEnable: boolean;
  };
  description: Description;
  barcodeIcon: string;
  colors: number[];
  paidFineTitle: string;
  payDescription: Description;
  fineListDescription: Description[];
  addPlateDescription: Description;
  addBarcodeDescription: Description;
  inquiryInfoDescription: Description;
  payTitle: string;
  payIcon: string;
  inquiryAmount: number;
  inquiryPayDescription: Description;
  inquiryMethods: InquiryMethodData[];
}

export interface Description {
  note: string;
  keywords: string[];
}

export interface InquiryMethodData {
  type: InquiryType;
  title: string;
  description: string;
  hoverImageId: string;
  imageId: string;
}

export interface FineUser {
  cellNumber: string;
  name: string;
  nationalCode: string;
  userId: string;
}
