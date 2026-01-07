import { Order } from '@client-monorepo/common/network';

export interface SocialSearchPostConfig {
  page: number;
  size: number;
  socialUserName?: string;
  postId?: string;
  postIds?: string[];
  project?: 'EXPLORE' | 'POST_STORE_FULL';
  searchText?: string;
  orders?: Order[];
}
