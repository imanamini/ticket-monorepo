export interface ICampaignProcess {
  action?: string;
  data: ICampaignProcessData;
}

export interface ICampaignProcessData {
  pageName: string;
  prizeAmount: string;
  phoneNumber: string;
  customerProfile: any;
  remainingDays: string;
  instrumentSymbol: string;
  countdownInSeconds: string;
  contractEtfAgreements: any[];
  instrumentDisplaySymbol: string;
}
