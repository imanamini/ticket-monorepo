import { IFundProfileModel } from '../../../../funds/models/fund-profile.model';

export interface IAddPasswordRouteState {
  symbol?: string;
  amount?: number;
  units?: number;
  type?: string;
  callShowDetail?: boolean;
  agreementChecked?: boolean;
  investmentType?: string;
  assetData?: IFundProfileModel;
}
