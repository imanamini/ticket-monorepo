import { BadgeStatusEnum } from '../enums/badge-status.enum';

export interface BadgeModel {
  status: BadgeStatusEnum;
  text: string;
}
