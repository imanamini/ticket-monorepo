export interface BaseUserSchedule {
  firstRun: string;
  nextRun: string;
  periodType: string;
  target: string;
  uid: string;
}

export interface PureUserSchedule extends BaseUserSchedule {
  payload: string;
}

export interface TollSchedulePayload {
  plateNo?: string;
}

export interface UserSchedule extends BaseUserSchedule {
  payload: TollSchedulePayload;
}
