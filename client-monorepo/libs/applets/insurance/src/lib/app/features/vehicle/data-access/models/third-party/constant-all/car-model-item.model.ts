import { CarDataModel } from './car-data.model';

// This is for model of car (206sd)
export interface CarModelItemModel extends CarDataModel {
  carTypeId: number;
  carBrandId: number;
}
