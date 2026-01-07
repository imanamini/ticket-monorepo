export type PromotionGroupProductStatsInterface = {
  [key in PromotionGroupProductStatsKeys]: { max: number; min: number };
};

export enum PromotionGroupProductStatsKeys {
  PRICE = 'price',
}
