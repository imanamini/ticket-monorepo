export interface IFundsejami {
  instrumentSettings: IInstrumentSetting[];
}

export interface IInstrumentSetting {
  title: string;
  symbol: string;
  isUpdated?: boolean;
  investmentType: string;
  thumbnailLogoAddress?: string;
}
