import { PlanServices } from '@client-monorepo/common/subscription';

export interface PlanServiceConfigModel extends PlanServices {
  title: string;
  icon: string;
  hasDetail: boolean;
  hasGift: boolean;
  description: PlanServiceDescription;
  detail?: PlanServiceConfigDetail;
  managementDescription?: PlanServiceDescription;
  managementDescriptionDetail?: PlanServiceDescription;
}

export interface PlanServiceDescription {
  text: string;
  keywords: string[];
}

export interface PlanServiceConfigDetail {
  title: string;
  subtitle: string;
  secondSubtitle?: string;
  icon: string;
  contents: { title?: string; points: string[]; firstPoint?: string }[];
  info?: { title: string; infoMessage: string };
}
