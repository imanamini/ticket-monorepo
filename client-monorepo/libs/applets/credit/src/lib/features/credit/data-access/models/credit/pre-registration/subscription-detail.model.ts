export interface SubscriptionDetailModel {
  type: SubscriptionType;
  title: string;
  durationInMonth: number;
  amount: number;
}

export type SubscriptionType = 'PLATINIUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'BRILLIANCE' | 'DIAMOND' | 'TITANIUM';
