import { MobileOperator } from '@client-monorepo/common/utilities';

export class InternetConfirm {
  bundleTitle?: string;
  operatorName!: string;
  simType!: string;
  cellNumber!: string;
  operatorId?: string;
  operator!: MobileOperator;
}
