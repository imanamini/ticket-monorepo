import { HomeActionButton } from './home-action-button';
import { HomeActionBar } from './home-action-bar';
import { BaseApiResponse } from '../base-api.response';

export interface CardsListResponse extends BaseApiResponse {
  title: string;
  actionButton: HomeActionButton;
  data: HomeCardDto[];
}

export interface HomeCardDto {
  card: HomeCard;
  actionBar: {
    [key: string]: HomeActionBar;
  };
}

export interface HomeCard {
  logoImageId?: string;
  imageId?: string;
  alias: Alias;
  mainValue: Alias;
  color: string[];
  leftLabel?: Alias;
  featureName?: string;
}

export interface Alias {
  value: string;
  textColor?: string;
  backgroundColor?: string;
}
