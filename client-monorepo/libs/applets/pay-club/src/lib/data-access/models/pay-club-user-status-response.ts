import { GenericApiResponse } from '@client-monorepo/common/network';

export interface PayClubUserStatusResponse extends GenericApiResponse {
  status: UserStatus;
}
export enum UserStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  BLOCKED = 2,
  NOT_FOUND = 3,
}
