import { GenericApiResponse } from '../../../api/digipay/models/generic-api-response.model';

export interface CreditPlanReceiptItem {
  title: string;
  value: string;
  description: string;
}

export interface CreditPlanDescriptionItem {
  title: string;
  description: string;
}

export interface CreditPlanDetailResponse extends GenericApiResponse {
  card: {
    badgeColor: number;
    balance: number;
    color: string;
    description: string;
    icon: string;
    installmentCount: number;
    title: string;
    planRuleType: PlanRuleEnum;
    balanceRange: {
      min: number;
      max: number;
    };
  };
  footer: string;
  header: string;
  receiptItems: CreditPlanReceiptItem[];
  descriptionItems: CreditPlanDescriptionItem[];
}

export enum PlanRuleEnum {
  STATIC,
  DYNAMIC,
}
