import { TransactionCard } from '../models/transaction-card';

export const DEFAULTTRANSACTIONCARD: TransactionCard = {
  type: 'history',
  title: '',
  date: Date.now(),
  description: '',
  showDivider: true,
  amount: { value: '', currency: 'ریال', amountStyle: 'normal' },
  status: { message: '', style: 'default' },
  image: { mode: 'single', type: 'image', url: '' },
  buttonType: undefined,
};
