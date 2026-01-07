import { GenericApiResponse } from '@client-monorepo/common/network';
import { PureUserSchedule, UserSchedule } from './user-schedule';

export interface PurSchedulesResponse extends GenericApiResponse {
  schedules: PureUserSchedule[];
}

export interface SchedulesResponse extends GenericApiResponse {
  schedules: UserSchedule[];
}
