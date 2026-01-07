export interface AppFundData {
  title?: string;
  annualProfit?: number;
  saleNav?: number;
  purchaseNav?: number;
  type?: string;
  symbol?: string;
  provider?: string;
  latestNavUpdate?: string;
  logoAddress?: string;
  statisticNav?: number;
  profit?: IProfitItem;
  investmentType?: 'Mutual' | 'ETF' | 'CrowdFund';
}

export interface IProfitItem {
  liquidity: string;
  periodicDividendDistribution: string;
  purchasePartOfEachUnit: string;
}
