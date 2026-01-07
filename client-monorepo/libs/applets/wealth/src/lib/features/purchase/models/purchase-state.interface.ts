import { IFundDetail } from '../../../components/core/models/fund-schemas';

export interface IPurchaseRouteState {
  type: string;
  investmentType: string;
  referrer?: string;
  backTo?: string;
  units?: number;
  amount?: number;
  fundProfile?: IFundDetail;
  agreementChecked?: boolean;
  callShowDetail?: boolean;
}
