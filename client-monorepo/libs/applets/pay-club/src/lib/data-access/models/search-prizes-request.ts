import { DrawStatus } from './reward-status';
import { RewardType } from './reward-type';

export interface SearchPrizesRequest {
  endDate: string;
  startDate: string;
  status: DrawStatus;
  type: RewardType;
}
