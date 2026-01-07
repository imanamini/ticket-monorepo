import { ECollateralRequestStatus } from './collateral-request-status.enum';

export interface ICollateralStatusResult {
  status: ECollateralRequestStatus;
  units?: number;
}
