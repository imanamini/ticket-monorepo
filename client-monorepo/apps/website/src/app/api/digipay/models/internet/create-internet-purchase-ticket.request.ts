import { OperatorIds } from '../carrier/operator-ids';

export interface CreateInternetPurchaseTicketRequest {
  targetedCellNumber: string;
  operatorId: OperatorIds;
  internetPackage: {
    bundleId: string;
    amount: number;
    description: string;
    duration: number;
  };
  redirectUrl: string;
  ticket?: string;
}
