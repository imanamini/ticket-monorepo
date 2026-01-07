import { ProductInterface } from '@client-monorepo/stores';
import { SocialPost } from '@client-monorepo/social';

export interface PromotionItemInterface {
  uuid: string;
  groupUID: string;
  fileName?: string;
  startTime: number;
  endTime: number;
  url?: string;
  product?: ProductInterface;
  instagramPost?: SocialPost;
}
