import { AppServiceCategoryInterface } from '../models/app-service-category.interface';
import { AppServiceCategoryNamesEnum } from '../models/app-service-category-names.enum';
import { AppServiceCategoryDescriptionConst } from './app-service-category-descriptions.const';

export const appServicesCategoriesConst: Record<AppServiceCategoryNamesEnum, AppServiceCategoryInterface> = {
  [AppServiceCategoryNamesEnum.PAY]: {
    name: AppServiceCategoryNamesEnum.PAY,
    description: AppServiceCategoryDescriptionConst[AppServiceCategoryNamesEnum.PAY],
  },
  [AppServiceCategoryNamesEnum.MOBILE]: {
    name: AppServiceCategoryNamesEnum.MOBILE,
    description: AppServiceCategoryDescriptionConst[AppServiceCategoryNamesEnum.MOBILE],
  },
  [AppServiceCategoryNamesEnum.WEALTH]: {
    name: AppServiceCategoryNamesEnum.WEALTH,
    description: AppServiceCategoryDescriptionConst[AppServiceCategoryNamesEnum.WEALTH],
  },
  [AppServiceCategoryNamesEnum.INSURANCE]: {
    name: AppServiceCategoryNamesEnum.INSURANCE,
    description: AppServiceCategoryDescriptionConst[AppServiceCategoryNamesEnum.INSURANCE],
  },
  [AppServiceCategoryNamesEnum.VEHICLE]: {
    name: AppServiceCategoryNamesEnum.VEHICLE,
    description: AppServiceCategoryDescriptionConst[AppServiceCategoryNamesEnum.VEHICLE],
  },
  [AppServiceCategoryNamesEnum.INSTALLMENT]: {
    name: AppServiceCategoryNamesEnum.INSTALLMENT,
    description: AppServiceCategoryDescriptionConst[AppServiceCategoryNamesEnum.INSTALLMENT],
  },
  [AppServiceCategoryNamesEnum.SUGGESTED_SERVICES]: {
    name: AppServiceCategoryNamesEnum.SUGGESTED_SERVICES,
    description: AppServiceCategoryDescriptionConst[AppServiceCategoryNamesEnum.SUGGESTED_SERVICES],
  },
  [AppServiceCategoryNamesEnum.OTHER_SERVICES]: {
    name: AppServiceCategoryNamesEnum.OTHER_SERVICES,
    description: AppServiceCategoryDescriptionConst[AppServiceCategoryNamesEnum.OTHER_SERVICES],
  },
  [AppServiceCategoryNamesEnum.BNPL_SERVICES]: {
    name: AppServiceCategoryNamesEnum.BNPL_SERVICES,
    description: AppServiceCategoryDescriptionConst[AppServiceCategoryNamesEnum.BNPL_SERVICES],
  },
  [AppServiceCategoryNamesEnum.BILL]: {
    name: AppServiceCategoryNamesEnum.BILL,
    description: AppServiceCategoryDescriptionConst[AppServiceCategoryNamesEnum.BILL],
  },
  [AppServiceCategoryNamesEnum.BNPL_CREDIT_SERVICES]: {
    name: AppServiceCategoryNamesEnum.BNPL_CREDIT_SERVICES,
    description: AppServiceCategoryDescriptionConst[AppServiceCategoryNamesEnum.BNPL_CREDIT_SERVICES],
  },
  [AppServiceCategoryNamesEnum.WALLET]: {
    name: AppServiceCategoryNamesEnum.WALLET,
    description: AppServiceCategoryDescriptionConst[AppServiceCategoryNamesEnum.WALLET],
  },
};
