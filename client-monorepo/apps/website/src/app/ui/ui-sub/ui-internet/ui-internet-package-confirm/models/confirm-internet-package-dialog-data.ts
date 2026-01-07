import { InternetPackage } from '../../../../../api/digipay/models/internet';
import { OperatorIds } from '../../../../../api/digipay/models/carrier/operator-ids';

export interface ConfirmInternetPackageDialogData {
  internetPackage: InternetPackage;
  cellNumber: string;
  carrier: OperatorIds;
  isLoggedIn: boolean;
  walletBalance: number;
}
