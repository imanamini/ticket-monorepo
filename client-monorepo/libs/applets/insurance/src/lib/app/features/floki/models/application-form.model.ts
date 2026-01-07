import { ProductModel } from './product.model';

export interface ApplicationFormModel {
  applicationFormId: string;
  assetPrice: number;
  productCategoryPath?: string;
  products?: ProductModel[];
}
