import { SanhabExInsurerModel } from '../third-party/sanhab/sanhab-ex-insurer.model';
import { SanhabCarInfoModel } from '../third-party/sanhab/sanhab-car-info.model';

export interface ApplicationFormPostResponseModel {
  id: string;
  insurer: SanhabExInsurerModel;
  car: SanhabCarInfoModel;
}
