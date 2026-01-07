import { ProductCardDetailsModel } from './product-card-details.model';
import { ProductCardGiftModel } from './product-card-gift.model';
import { ProductCardExtraDetailModel } from './product-card-extra-detail.model';

export interface InsuranceCompanyModel {
  id: number;
  name: string;
  logo: string;
  slug: string;
  order: number;
  providerId: number;
  details: ProductCardDetailsModel;
  gifts: ProductCardGiftModel[];
  extraDetails: ProductCardExtraDetailModel;
}
