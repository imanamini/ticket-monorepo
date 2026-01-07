import { MessageVisibilityEnum } from './message-visibility.enum';
import { MessageTemplateEnum } from './message-template.enum';
import { GenericApiResponse } from '@client-monorepo/common/network';
import {
  AppMessagingCategoryEnum,
  MessageAvatarInterface,
  MessageBadgeInterface,
  MessageCtaInterface,
} from '@client-monorepo/shared/common';
import { SafeHtml } from '@angular/platform-browser';

export interface MessagesResponse extends GenericApiResponse {
  messages: Message[];
  hasNext: boolean;
}
export interface Message {
  messageId: string;
  title: string;
  content: string;
  safeContent: SafeHtml;
  bannerImageId: string;
  type: MessageTypes;
  categories: AppMessagingCategoryEnum[];
  badge: string; //JSON
  parseBadge: MessageBadgeInterface | undefined;
  template: MessageTemplateEnum;
  scheduledDate: number;
  scheduledDateFormatted?: string;
  expireDate: number;
  cta: string; //JSON
  parseCta: MessageCtaInterface;
  avatar: string; //JSON
  parseAvatar: MessageAvatarInterface;
  visibility: MessageVisibilityEnum;
  isRead: boolean;
  isExpired: boolean;
}

export enum MessageTypes {
  ALERT = 0,
  SPECIAL = 1,
  NORMAL = 2,
}
