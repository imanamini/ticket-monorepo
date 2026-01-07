import { PlanServices } from './subscription-plan.model';

export interface PlanServiceConfigModel extends PlanServices {
  title: string;
  icon: string;
  hasDetail: boolean;
  description: {
    text: string;
    keywords: string[];
  };
  detail?: PlanServiceConfigDetail;
}

export interface PlanServiceConfigDetail {
  title: string;
  subtitle: string;
  secondSubtitle?: string;
  icon: string;
  contents: { title?: string; points: string[]; firstPoint?: string }[];
}
