import { HomeFeed } from './home-feed';
import { BaseApiResponse } from '../../base-api.response';

export interface FeedsResponse extends BaseApiResponse {
  feeds: HomeFeed[];
}
