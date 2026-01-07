import { ICrowdFundingPurchaseData } from '../../../features/crowds/data-access/models';
import { IFundProfileModel } from '../../../features/funds/models/fund-profile.model';

export interface IPayment {
  amount: number;
  symbol: string;
  instrumentUnit: number;
  units?: number;
  type?: string;
  agreementChecked?: boolean;
  usedBrokerCredit?: boolean;
  investmentType?: string;
  assetData?: IFundProfileModel | ICrowdFundingPurchaseData;
  ipoPaymentMethod?: string;
}
