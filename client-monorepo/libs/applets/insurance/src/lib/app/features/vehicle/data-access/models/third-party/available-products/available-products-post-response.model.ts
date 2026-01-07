import { ProductCardModel } from './product-card.model';

export interface AvailableProductsPostResponseModel {
  sessionId: string;
  retryCount: number;
  isComplete: boolean;
  isExpired: boolean;
  data: ProductCardModel[];
  interval: number;
}
