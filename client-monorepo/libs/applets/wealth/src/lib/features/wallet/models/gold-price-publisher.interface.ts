export interface IGoldPricePublisher {
  sec: number;
  changePercent: number;
  index: number;
  value: number;
  balance: number;
  dateTime: string;
  valueChanged: boolean;
  weightInGrams: number;
  anyGoldPendingTrade: boolean;
  uncollectibleBalance: number;
  withdrawalBalance: number;
}
