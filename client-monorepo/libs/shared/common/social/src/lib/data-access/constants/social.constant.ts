import { Restriction, RestrictionTypes } from '@client-monorepo/common/network';
import { StoreRestrictionFields, StoreType } from '@client-monorepo/stores';

export enum SocialRestrictionFields {
  TITLE = 'title',
  SORT = 'sort',
  USER_NAME = 'username',
  EXPIRED = 'expired',
  KEYWORD = 'keyword',
  POST_ID = 'postId',
  TIMESTAMP = 'timestamp',
}

export const socialDefaultRestriction: Restriction<StoreRestrictionFields> = {
  type: RestrictionTypes.COLLECTION,
  field: StoreRestrictionFields.STORE_TYPE,
  values: [StoreType.SOCIAL_INSTAGRAM],
};

export enum InstagramMediaTypes {
  IMAGE,
  VIDEO,
  SLIDE,
}

export const SocialStoreEventPrefix = 'stores-social-store-';
export const SocialProductEventPrefix = 'stores-social-product-';
