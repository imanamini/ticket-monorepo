export interface ProfileResponse {
  nationalId?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isSejami?: boolean;
  hasPassword?: boolean;
  instrumentSettings?: IInstrumentSetting[];
  bankAccounts?: IBanckAccount[];
  onboardedSections?: string;
}

export interface IInstrumentSetting {
  title?: string;
  symbol?: string;
  investmentType?: string;
  thumbnailLogoAddress?: string;
}

export interface IBanckAccount {
  bankName?: string;
  shabaNumber?: string;
  accountNumber?: string;
  typeName?: string;
  isDefault?: boolean;
  lastUpdateDateTimeUTC?: string;
}