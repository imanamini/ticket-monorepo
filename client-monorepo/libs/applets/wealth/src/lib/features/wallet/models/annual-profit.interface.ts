export interface IAnnualProfit {
  annuallyPnls: IDetailAnnual[];
  hasMoreProfit: boolean;
  totalProfit?: number;
  totalRecords?: number;
}

export interface IDetailAnnual {
  title: string;
  monthlyPnls: IMonthDetail[];
}

export interface IMonthDetail {
  title: string;
  amount: number;
}
