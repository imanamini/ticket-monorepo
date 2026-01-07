export interface CampaignWalletRequest {
  nationalCode: string;
  birthDate: string;
  journalType: JournalTypeEnum;
}

export enum JournalTypeEnum {
  SUBSCRIPTION_ALLOCATE,
  POSE_LANDING,
  CAMPAIGN,
  PDP,
  DEFAULT,
}
