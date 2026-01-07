import { GenericApiResponse } from '../../generic-api-response.model';
import { PlanRuleEnum } from './credit-plan-group';
import { SERVICE_TYPE } from '../service-type/service-type.model';

export interface CreditPlanReceiptItem {
  title: string;
  value: string;
  description: string;
  isOpen?: boolean;
}

export interface CreditPlanDescriptionItem {
  title: string;
  description: string;
  value: string;
  isOpen: boolean;
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
  serviceType: SERVICE_TYPE;
}
