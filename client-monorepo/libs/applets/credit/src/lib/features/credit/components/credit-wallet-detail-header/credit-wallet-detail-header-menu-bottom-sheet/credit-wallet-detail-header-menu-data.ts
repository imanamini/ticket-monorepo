export type CreditWalletDetailHeaderMenuDataType = 'SHOW_PURCHASE_DETAILS' | 'SHOW_AGREEMENTS';

export interface CreditWalletDetailHeaderMenuDataItem {
  title: string;
  type: CreditWalletDetailHeaderMenuDataType;
}

export interface CreditWalletDetailHeaderMenuData {
  items: CreditWalletDetailHeaderMenuDataItem[];
  creditId: string;
  showAgreements: boolean;
}
