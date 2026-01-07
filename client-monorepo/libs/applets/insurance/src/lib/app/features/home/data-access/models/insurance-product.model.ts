import { InsuranceProductsEnum } from '../constants/home.const';
import { BadgeModel } from '../../../../data-access/models/badge.model';

export interface InsuranceProductModel {
  logo: string;
  title: string;
  url: string;
  badge?: BadgeModel;
  type: InsuranceProductsEnum;
}
