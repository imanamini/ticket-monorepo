import { HOUSE_INCIDENTS_POLICY_STATE_ENUM } from '../../features/policy/data-access/enums/house-incidents-policy-state.enum';

export interface Price {
  paidAt: number;
  paymentMethod?: any;
  temporaryPrice: number;
  payableAmount: number;
  totalDiscountAmount: number;
  cashAmount: number;
  creditAmount: number;
  finalPrice: number;
  providerPrice: number;
}

export interface InsurerParty {
  name: string;
  logo: string;
}

export interface AccidentCoverageDetails {
  title: string;
  amount: number;
}

export interface Data {
  plan: string;
  duration: string;
  title: string;
  description: string;
  insurerParty: InsurerParty;
  payableAmount: number;
  accidentCoverageDetails: AccidentCoverageDetails[];
}

export interface RequesterParty {
  firstName?: any;
  lastName?: any;
  birthDate?: any;
  nationalCode?: any;
  email?: any;
  mobile: string;
  address?: any;
  postalCode?: any;
}

export interface InsuredParty {
  firstName: string;
  lastName: string;
  birthDate?: any;
  nationalCode: string;
  email?: any;
  mobile: string;
  address: string;
  postalCode: string;
}

export interface HouseIncidentPolicyCardModel {
  id: string;
  trackingCode: number;
  price: Price;
  data: Data;
  requesterParty: RequesterParty;
  insuredParty: InsuredParty;
  state: HOUSE_INCIDENTS_POLICY_STATE_ENUM;
  stateTitle: string;
  canDownloadPolicy: boolean;
}

export interface HouseIncidentListResponseModel {
  data: HouseIncidentPolicyCardModel[];
  paging?: any;
}
