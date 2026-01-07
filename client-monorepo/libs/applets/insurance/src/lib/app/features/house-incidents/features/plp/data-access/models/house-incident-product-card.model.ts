export interface AccidentCoverageDetails {
  title: string;
  amount: number;
}

export interface InsurerParty {
  id: string;
  name: string;
  logo: string;
}

export interface HouseIncidentProductCardModel {
  plan: string;
  title: string;
  duration?: string;
  description: string;
  insurerParty: InsurerParty;
  payableAmount: number;
  accidentCoverageDetails: AccidentCoverageDetails[];
}

export interface HouseAvailableProductModel {
  data: HouseIncidentProductCardModel[];
  id?: string;
}
