import { TextValue } from './text-value';

export interface ContractPurchaseSubItem {
  icon: string;
  parentTrackingCode?: string;
  trackingCode: string;
  title: TextValue;
  date: TextValue;
  orderId: TextValue;
  moreDetails: TextValue[];
}
