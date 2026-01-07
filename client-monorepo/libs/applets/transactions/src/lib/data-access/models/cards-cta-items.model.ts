import { CardCtaTypes } from '../constants/card-cta-types.const';
import { StatusLightBordersEnum, StatusLightColorsEnum, StatusLightSizesEnum } from '@client-monorepo/common/ui-components';
import { Action } from '@client-monorepo/common/action-handler';

export interface CardsCtaItemsModel {
  cardsType: CardCtaTypes;
  actions: CardCtaItems[];
}

export interface CardCtaItems {
  name: string;
  icon: CtaIconModel;
  isHighlighted: boolean;
  hasNotification: boolean;
  isDisabled: boolean;
  notification?: NotificationModel;
  hasChildren: boolean;
  action: Action;
  children?: CardCtaItems[];
}

interface CtaIconModel {
  name: string;
  type: 'bold' | 'linear' | 'due';
  secondColor?: string;
}

interface NotificationModel {
  size: StatusLightSizesEnum;
  color: StatusLightColorsEnum;
  border: StatusLightBordersEnum;
}
