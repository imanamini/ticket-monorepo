import { ECreditStatus } from './credit-status.enum';

export interface ICancelBnpl {
  status: ECreditStatus;
  message: string;
}
