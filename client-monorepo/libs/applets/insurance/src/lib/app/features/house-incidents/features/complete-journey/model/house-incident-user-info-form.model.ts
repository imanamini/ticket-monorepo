export interface InsuredPartyDetail {
  firstName: string;
  lastName: string;
  nationalCode: string;
  mobile: string;
}

export interface Address {
  address: string;
  postalCode: string;
}

export interface HouseIncidentCompleteInfoModel {
  insuredPartyDetail: InsuredPartyDetail;
  address: Address;
}
