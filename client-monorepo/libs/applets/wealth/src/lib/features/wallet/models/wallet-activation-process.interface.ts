export interface IWalletActivationProcess {
  action: string;
  data: IWalletActivationProcessData;
}

export interface IWalletActivationProcessData {
  message: string;
  pageName: string;
  success: boolean;
}
