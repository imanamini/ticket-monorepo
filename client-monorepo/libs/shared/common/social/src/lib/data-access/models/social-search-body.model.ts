import { SearchPayloadInterface } from '@client-monorepo/common/network';
import { SocialRestrictionFields } from '../constants/social.constant';

export interface SocialSearchBodyModel {
  searchRequest?: SearchPayloadInterface<SocialRestrictionFields>;
}
