import { CarDataModel } from './car-data.model';

export interface CarBrandModel extends CarDataModel {
  logo: string;
  carTypes: CarDataModel[];
}
