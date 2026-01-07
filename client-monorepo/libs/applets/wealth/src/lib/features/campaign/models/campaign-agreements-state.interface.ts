import { UserInfoModel } from '../../user-profile/models/user-info.model';
import { ICustomerAgreement } from '../../../components/core/models/customer-agreement.interface';
import { ICollateralProcessData } from '../../collateral/data-access/models';

export interface ICompaignState {
  phoneNumber: string;
  campaignCode: string;
  userInfo: UserInfoModel;
  agreements: ICustomerAgreement[];
  nextPage: string;
  role: string;
  symbol: string;
  coordinatorAction: string;
  nationalId: string;
  maxAmount: string;
  minAmount: string;
  data: ICollateralProcessData;
  countDown?: string;
}
