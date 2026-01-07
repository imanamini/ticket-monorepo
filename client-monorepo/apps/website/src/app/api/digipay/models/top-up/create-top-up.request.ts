import { OperatorIds } from '../carrier/operator-ids';
import { SimType } from '../common/sim-type';

export interface CreateTopUpRequest {
  chargeType: number;
  targetedCellNumber: string;
  chargePackage: {
    amount: number;
  };
  operatorId: OperatorIds;
  redirectUrl: string;
  ticket?: string;
  cellNumberType: SimType;
}
