import { NgxBadgeMode, NgxBadgeStatus } from '@digipay/ngx-badge/lib/ngx-badge.type';
import { Action } from '@client-monorepo/common/action-handler';
import { ServiceImagesType } from '@client-monorepo/common/service-data';

export type ItemOverview = {
  id?: string;
  image: ServiceImage;
  title: string;
  badge?: ServiceBadge;
  auctionBadge?: boolean;
  subTitleNormal?: string;
  subTitleBold?: string;
  divider?: boolean;
  action?: Action;
  score?: Score;
};

type ServiceImage = {
  type: ServiceImagesType; // logo or icon
  name: string;
  color?: string;
};

export type ServiceBadge = {
  text: string;
  status: NgxBadgeStatus;
  mode: NgxBadgeMode;
};

export type SelectedSectionHeader = {
  image: string;
  title?: string;
  subTitle?: string;
  imageType?: ServiceImagesType;
};

export type Score = {
  amount: number;
  count: number;
};
