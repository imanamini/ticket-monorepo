import { ICrowdFundingPurchaseData } from '../../crowds/data-access/models';
import { IFundProfileModel } from '../../funds/models/fund-profile.model';
import { EIpoPaymentMethodAgreement } from './ipo-payment-method-agreement';

export interface IChoosePaymentWay {
  agreementType: EIpoPaymentMethodAgreement;
  assetData?: IFundProfileModel | ICrowdFundingPurchaseData;
}
