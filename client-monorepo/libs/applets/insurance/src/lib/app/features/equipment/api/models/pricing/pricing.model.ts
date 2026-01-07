export interface PricingModel {
  pricingList: PricingListModel[];
  suggestedPrice: SuggestedPriceModel;
}

export interface PricingListModel {
  title: string;
  saleChannel: string;
  category: string;
  pricingId: string;
  parentId: string;
  maxValue: number;
  minValue: number;
  wagePercent: number;
  fixedWageAmount: number;
  model: string;
  templateId: string;
  isFirstRange: boolean;
  isLastRange: boolean;
  calculationType: number;
  children: any;
  suggestedPrice: number;
  suggestedPriceDatePeriod: string;
  categoryTitle: string;
}

export interface SuggestedPriceModel {
  value: number;
  fixedWageAmount?: number;
  period?: string;
}

