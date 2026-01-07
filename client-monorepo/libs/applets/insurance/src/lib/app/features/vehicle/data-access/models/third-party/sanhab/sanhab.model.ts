import { SanhabExInsurerModel } from './sanhab-ex-insurer.model';
import { SanhabCarInfoModel } from './sanhab-car-info.model';

export interface SanhabModel {
  insurer: SanhabExInsurerModel;
  car: SanhabCarInfoModel;
}

