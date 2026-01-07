import { CarDataModel } from './car-data.model';

export interface CarUsageModel extends CarDataModel {
  carTypeId: number;
}
