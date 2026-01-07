import { StorePaymentMethod } from '@client-monorepo/stores';
import { InstagramMediaTypes } from '../constants/social.constant';
import { GenericApiResponse } from '@client-monorepo/common/network';

export interface SocialPostResponseModel extends GenericApiResponse {
  facets: Facet[];
  posts: SocialPost[];
  queryId: string;
  hasFiltered?: boolean;
}

export interface Facet {
  additionalProp1: any;
  additionalProp2: any;
  additionalProp3: any;
}

export interface SocialPost {
  caption: string;
  cart: number;
  click: number;
  commentCount: number;
  crawledDate: number;
  crawledDoc: boolean;
  dimensions: SocialPostDimensions;
  documentId: string;
  downloadableThumbnailUrl: string;
  downloadableVideoUrl?: string;
  downloadableSlideUrls?: string[];
  expired: number;
  hostName: string;
  likeCount: number;
  mediaType: InstagramMediaTypes;
  modificationDate: number;
  postId: string;
  shortCode?: string;
  storeLogoImageId?: string;
  storeName?: string;
  storePaymentMethods?: StorePaymentMethod[];
  storeTrackingCode?: string;
  storeWhatsAppCellphone?: string;
  thumbnailUrl: string;
  timestamp: number;
  url: string;
  username: string;
  videoUrl?: string;
}

export interface SocialPostDimensions {
  height: number;
  width: number;
}

export interface SocialSlide {
  url: string;
  type: 'image' | 'video';
}
