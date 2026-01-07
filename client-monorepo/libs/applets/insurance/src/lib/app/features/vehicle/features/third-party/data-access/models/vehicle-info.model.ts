import { CompanyDataModel } from './company-data.model';
import { IdTitleModel } from './id-title.model';

export interface VehicleInfoModel {
  carType: IdTitleModel;
  carUsage: IdTitleModel;
  carBrand: IdTitleModel & { logo: string };
  carModel: IdTitleModel;
  buildYear: string;
  ownershipChanged?: boolean;
  releaseDate?: any;
}
