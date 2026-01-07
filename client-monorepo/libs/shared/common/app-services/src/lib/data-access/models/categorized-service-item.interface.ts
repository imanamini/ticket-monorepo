import { FrequentServiceInterface, ServiceImagesType } from '@client-monorepo/common/service-data';
import { RecommendedBillTypeInterface } from './recommended-bill-type.interface';

export interface CategorizedServiceItemInterface {
  type: 'service' | 'bill';
  data: FrequentServiceInterface | TempRecommendedBillTypeInterface;
}

export interface TempRecommendedBillTypeInterface extends RecommendedBillTypeInterface {
  imageType?: ServiceImagesType; // for support new framed-icon component
  badge?: any;
  icon?: string;
}
export interface CategorizedServiceItemServiceInterface extends CategorizedServiceItemInterface {
  type: 'service';
  data: FrequentServiceInterface;
}

export interface CategorizedServiceItemBillInterface extends CategorizedServiceItemInterface {
  type: 'bill';
  data: TempRecommendedBillTypeInterface;
}
