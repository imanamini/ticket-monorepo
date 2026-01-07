export enum SortMethod {
  // DigipayProposal,
  AscendingCost,
  DescendingCost,
  DescendingScore,
  DescendingCompensationBranches,
}

export const SORT_METHOD_TRANSLATIONS = {
  // [SortMethod.DigipayProposal]: 'پیشنهاد دیجی پی',
  [SortMethod.AscendingCost]: 'ارزان‌ترین',
  [SortMethod.DescendingCost]: 'گران‌ترین',
  [SortMethod.DescendingScore]: 'بیشترین امتیاز کاربران',
  [SortMethod.DescendingCompensationBranches]: 'بیشترین تعداد شعب پرداخت خسارت',
};
