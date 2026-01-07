import {
  FrequentBundlePayload,
  FrequentC2CPayload,
  UpcomingBillPayload,
  UpcomingInstallmentPayload,
  UpcomingScheduledPayload,
} from './payment';

export type TransactionCard = {
  id?: string;
  type: 'upcoming' | 'history' | 'frequent' | 'pending';
  title: string;
  date?: number;
  description?: string;
  showDivider: boolean;
  amount: TransactionAmount;
  status: TransactionStatus;
  image: TransactionImage;
  buttonType: 'normal' | 'urgent' | 'link-button' | undefined;
  exerciseDate?: number;
  frequentType?: 'c2c' | 'bundle';
  trackingCode?: string;
  upcomingType?: 'installment' | 'scheduled' | 'bill';
  creditId?: string;
  payload?: UpcomingScheduledPayload | UpcomingBillPayload | UpcomingInstallmentPayload | FrequentC2CPayload | FrequentBundlePayload;
};

type TransactionStatus = {
  message: string;
  style: 'default' | 'error';
};

type TransactionAmount = {
  value: string;
  amountStyle: 'normal' | 'income' | 'disabled' | 'dense';
  currency: string;
};

export type TransactionImage = {
  mode: 'single' | 'double';
  type: 'image' | 'avatar' | 'icon' | 'logo' | 'logo-on-back';
  url?: string;
  id?: string;
  icon?: TransactionIcon;
  badge?: 'error' | 'add' | 'pending' | undefined;
  secondImageType?: 'image' | 'avatar' | 'icon' | 'logo';
  secondImageUrl?: string;
  secondIcon?: TransactionIcon;
  secondId?: string;
};

export type TransactionIcon = {
  icon: string;
  iconSize?: string;
  iconType?: 'linear' | 'bold' | 'due';
  classes?: string;
};
