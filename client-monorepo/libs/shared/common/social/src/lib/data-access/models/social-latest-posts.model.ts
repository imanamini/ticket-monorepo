import { GenericApiResponse } from '@client-monorepo/common/network';
import { SocialPost } from '@client-monorepo/social';

export interface SocialLatestPostsResponse extends GenericApiResponse {
  storePosts: SocialStorePost[];
}

export interface SocialStorePost {
  instagramUsername: string;
  posts: SocialPost[];
  storeLogoImageId: string;
  storeName: string;
  storeTrackingCode: string;
}
