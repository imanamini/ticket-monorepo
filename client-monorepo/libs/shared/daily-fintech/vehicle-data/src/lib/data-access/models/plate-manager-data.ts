import { StoredPlate, UserSchedule } from '@client-monorepo/daily-fintech/vehicle-data';

export type PlateManagerChange = 'delete' | 'add' | 'edit' | 'no-change';
export type ScheduleChange = 'add' | 'delete' | 'no-change';

export interface PlateManagerInputData<PlateType = StoredPlate> {
  plate?: PlateType;
  schedule?: UserSchedule;
  hasSchedule: boolean;
}

export interface PlateManagerOutputData<PlateType = StoredPlate> {
  plate?: PlateType;
  schedule: ScheduleChange;
  changed: PlateManagerChange;
}
