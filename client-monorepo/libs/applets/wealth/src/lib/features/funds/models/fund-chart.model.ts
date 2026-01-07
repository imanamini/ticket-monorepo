export interface IFundChart {
  date?: string;
  issueNav?: number;
  cancelNav?: number;
  statisticalNav?: number;
}
export interface IStockFundChart {
  closeNav: number;
  date: string;
  highNav: number;
  lowNav: number;
  openNav: number;
  overallNav: number;
}

export interface IFundPortfolioChart {
  bond?: number;
  cash?: number;
  commodity?: number;
  date?: string;
  deposit?: number;
  fiveBest?: number;
  fundUnit?: number;
  other?: number;
  stock?: number;
}

export interface IFundPortfolioGoldChart {
  goldBar?: number;
  goldCoin?: number;
}

export interface IFundChartResult {
  details: IFundChart[];
  portfolioDetails: (IFundPortfolioChart & Partial<IFundPortfolioGoldChart>)[];
}
export interface IStockFundChartResult {
  details: IStockFundChart[];
}
