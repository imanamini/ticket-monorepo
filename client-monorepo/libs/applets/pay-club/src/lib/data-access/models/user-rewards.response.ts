import { GenericApiResponse } from '@client-monorepo/common/network';
import { DrawStatus } from './reward-status';
import { CapacityType } from './capacity-type';
import { RewardType } from './reward-type';

export interface UserRewardsResponse extends GenericApiResponse {
  prizes: Prize[];
  currentTime: number;
}

export interface Prize {
  acquisitionResult: {
    code: string;
    nextAllowedAcquireTime: number;
    status: DrawStatus;
    trackingCode?: string;
  };
  info: Reward;
}

export interface Reward {
  bannerImageId: string;
  briefDescription: string;
  business: {
    cellNumber: string;
    imageId: string;
    name: string;
  };
  capacity: {
    remainingCount: number;
    type: CapacityType;
  };
  executionDate: number; // for lottery
  expirationDate: number;
  fullDescription: string;
  lockingDuration: number; // for voucher
  groupId: string;
  imageId: string;
  score: number;
  title: string;
  type: RewardType;
  remainingTimePurchase?: number;
  remainingTimeExecution?: number;
  formatExecutionDate?: string;
}
