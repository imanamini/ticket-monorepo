export interface LeadModel {
  policyNumber: number;
  firstName: string;
  lastName: string;
  productId: string;
  productName: string;
  productCategory: string;
  productBrand: string;
  productModel: string;
  durationUnit: string;
  productPrice: number;
  productPriceWithDiscount: number;
  payableAmount: number;
  durationValue: number;
  orderDeadLineDays: number;
  mobile: string;
  isSpecialUser: boolean;
  providerId: string;
  unUsable: boolean;
  unUsableReason: string;
  discountCode: string;
  isValidDiscountCode: boolean;
  discountAmount: number;
  wageAmount: number;
  haveSerialNumber: boolean;
  serialNumber?: string;
  productCategoryFa: string;
  planTitle: string;
  wagePercent: number;
  displayWageAmount: number;
  isValidSerialNumber: boolean;
  totalAmount: number;
  unUsableReasonSerialNumber: string;
  unUsableReasonDiscountCode: string;
  taxAmount: number;
  isPayable: boolean;
  pdfUrl?: string;
  purchaseCampaignDetail: CampaignDetails;
  coverages: LeadCoverage[];
}

export interface CampaignDetails {
  discountCode: string;
}

export type LeadCoverage =
  'Hardware'
  | 'FullCoverageStealing'
  | 'Irresponsibility'
  | 'Water'
  | 'Damage'
  | 'Fire'
  | 'Disaster'
  | 'Stealing';
