export interface IFaqResponse {
  fixedIncome: IFaqItem[];
  stock: IFaqItem[];
}

export interface IFaqItem {
  question: string;
  answer: string;
}
