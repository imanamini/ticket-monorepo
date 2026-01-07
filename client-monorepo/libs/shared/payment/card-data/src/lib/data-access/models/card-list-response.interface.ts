import { GenericApiResponse } from '@client-monorepo/common/network';
import { CardOverview } from './card-overview.interface';
import { CardActionBar } from './card-action-bar.interface';
import { Action } from '@client-monorepo/common/action-handler';

export interface CardListResponse extends GenericApiResponse {
  title: string;
  actionButton: any;
  data: CardActionOverview[];
}

export interface CardActionOverview {
  alias?: string;
  status?: number;
  uniqueId?: number;
  balance?: number;
  expirationDate?: string;
  card: CardOverview;
  defaultAction?: Action;
  actionBar: {
    [key: string]: CardActionBar;
  };
}
