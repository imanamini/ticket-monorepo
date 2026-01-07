import { InsuranceCompanyModel } from './insurance-company.model';
import { ProductCardPriceModel } from './product-card-price.model';

export interface ProductCardModel {
  id: number;
  company: InsuranceCompanyModel;
  price: ProductCardPriceModel;
  creditEnabled: boolean;
}
