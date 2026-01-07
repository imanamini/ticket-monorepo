export interface UserInfoModel {
  isSejami: boolean;
  nationalId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bankAccounts: BankAccountModel[];
  instrumentSettings: InstrumentSettingModel[];
  hasPassword: boolean;
  onboardedSections?: string;
}

export interface InstrumentSettingModel {
  title: string;
  symbol: string;
  thumbnailLogoAddress?: string;
  editable?: boolean;
}

export interface BankAccountModel {
  bankName: string;
  typeName: string;
  isDefault: boolean;
  shabaNumber: string;
  accountNumber: string;
  lastUpdateDateTimeUTC: string;
}
