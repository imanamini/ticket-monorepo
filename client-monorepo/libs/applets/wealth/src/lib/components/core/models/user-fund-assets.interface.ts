export interface IUserFundAssets {
  balance: number;
  portfolioDetails: IPortfolioDetail[];
}

export interface IPortfolioDetail {
  lastUpdatedAt: string;
  price: number;
  quantity: number;
  symbol: string;
  title: string;
  type: string;
  investmentType: string;
}
