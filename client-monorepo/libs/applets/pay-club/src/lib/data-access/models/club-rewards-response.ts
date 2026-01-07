import { GenericApiResponse } from '@client-monorepo/common/network';
import { Prize, Reward } from './user-rewards.response';

export interface ClubRewardsResponse extends GenericApiResponse {
  currentTime: number;
  lotteries: Reward[]; //in continue should be converted to Prize interface
  vouchers: Reward[];
}

export interface ManipulatedClubRewardsInterface extends Omit<ClubRewardsResponse, 'lotteries' | 'vouchers'> {
  lotteries: Prize[]; //in continue should be converted to Prize interface
  vouchers: Prize[];
}
