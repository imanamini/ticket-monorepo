import { HouseIncidentProductCardModel } from '../../plp/data-access/models/house-incident-product-card.model';

export interface Price {
  paidAt: number;
  paymentMethod: number;
  temporaryPrice: number;
  payableAmount: number;
  totalDiscountAmount: number;
  cashAmount: number;
  creditAmount: number;
  finalPrice: number;
  providerPrice: number;
  discountCode: string;
}

export interface InsuredParty {
  fullName: string;
  firstName: string;
  lastName: string;
  birthDate?: number;
  nationalCode: string;
  email?: string;
  mobile: string;
  address: string;
  postalCode: string;
}

export interface PolicyUserInfoModel {
  id: string;
  trackingCode: number;
  price: Price;
  data: HouseIncidentProductCardModel;
  requesterParty: InsuredParty;
  insuredParty: InsuredParty;
  state: string;
  journeyType: string;
  stateTitle: string;
  canDownloadPolicy: boolean;
}
