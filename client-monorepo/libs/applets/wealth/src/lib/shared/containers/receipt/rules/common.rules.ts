import { OrderStatus } from '../../../../data-access/enums/order-status';
import { IReceipt } from '../../../../data-access/models/receipt.interface';
import {
  isIPO,
  isETF,
  isSell,
  isBuy,
  isWalletWithdraw,
  isWalletDeposit,
  isWithdraw,
  isOverplus,
  hasStatus,
  isProfit,
  isDeposit,
} from '../utils/predicates';

export type CommonRule = {
  when: (r: IReceipt) => boolean;
  text: () => string;
};

export const receiptCommonRules = {
  // Profit / Overplus: Short-circuit
  profitWaiting: {
    when: (r) => isProfit(r) && hasStatus(r, OrderStatus.Draft, OrderStatus.Waiting),
    text: () => 'سود سرمایه‌گذاری به حساب شما واریز خواهد شد',
  },
  profitSuccess: {
    when: (r) => isProfit(r),
    text: () => 'سود سرمایه‌گذاری واریز شد',
  },
  overplusWaiting: {
    when: (r) => isOverplus(r) && hasStatus(r, OrderStatus.Draft, OrderStatus.Waiting),
    text: () => 'تتمه سرمایه‌گذاری به حساب شما واریز خواهد شد',
  },
  overplusSuccess: {
    when: (r) => isOverplus(r),
    text: () => 'تتمه سرمایه‌گذاری واریز شد',
  },

  // Draft/Waiting
  buyWaiting: {
    when: (r) => hasStatus(r, OrderStatus.Draft, OrderStatus.Waiting) && isBuy(r) && !isIPO(r),
    text: () => 'سرمایه‌گذاری در حال انجام است',
  },
  sellWaiting: {
    when: (r) => hasStatus(r, OrderStatus.Draft, OrderStatus.Waiting) && isSell(r) && !isIPO(r),
    text: () => 'فروش در حال انجام است',
  },
  walletWithdrawWaiting: {
    when: (r) => hasStatus(r, OrderStatus.Draft, OrderStatus.Waiting) && isWalletWithdraw(r),
    text: () => 'برداشت از کیف پول ETF در حال انجام است',
  },
  buyIpoWaiting: {
    when: (r) => hasStatus(r, OrderStatus.Draft) && isIPO(r),
    text: () => 'درخواست خرید شما ثبت شد',
  },

  // Rejected by Manager/System
  ipoRejected: {
    when: (r) => hasStatus(r, OrderStatus.RejectedByManager, OrderStatus.RejectedBySystem) && isIPO(r),
    text: () => 'درخواست خرید شما انجام نشد',
  },
  buyRejected: {
    when: (r) => hasStatus(r, OrderStatus.RejectedByManager) && isBuy(r),
    text: () => 'درخواست خرید شما توسط سیستم رد شد',
  },
  sellRejected: {
    when: (r) => hasStatus(r, OrderStatus.RejectedByManager) && isSell(r),
    text: () => 'درخواست فروش شما توسط سیستم رد شد',
  },
  walletWithdrawRejected: {
    when: (r) => hasStatus(r, OrderStatus.RejectedBySystem) && isWalletWithdraw(r),
    text: () => 'درخواست برداشت شما توسط سیستم رد شد',
  },
  buyRejectedManager: {
    when: (r) => hasStatus(r, OrderStatus.RejectedBySystem) && isBuy(r),
    text: () => 'درخواست خرید شما توسط مدیر صندوق رد شد',
  },
  sellRejectedManager: {
    when: (r) => hasStatus(r, OrderStatus.RejectedBySystem) && isSell(r),
    text: () => 'درخواست فروش شما توسط مدیر صندوق رد شد',
  },

  // Approved/Success
  buyIpoSuccess: {
    when: (r) => hasStatus(r, OrderStatus.Approved, OrderStatus.Success) && isIPO(r),
    text: () => 'خرید شما انجام شد',
  },
  walletWithdrawSuccess: {
    when: (r) => hasStatus(r, OrderStatus.Approved, OrderStatus.Success) && isWalletWithdraw(r),
    text: () => 'درخواست برداشت از کیف پول ETF با موفقیت ثبت شد.',
  },
  walletDepositSuccess: {
    when: (r) => hasStatus(r, OrderStatus.Approved, OrderStatus.Success) && isWalletDeposit(r),
    text: () => 'واریز انجام شد',
  },
  buySuccess: {
    when: (r) => hasStatus(r, OrderStatus.Approved, OrderStatus.Success) && isBuy(r),
    text: () => 'سرمایه‌گذاری انجام شد',
  },
  sellSuccess: {
    when: (r) => hasStatus(r, OrderStatus.Approved, OrderStatus.Success) && isSell(r),
    text: () => 'فروش انجام شد',
  },
  depositSuccess: {
    when: (r) => hasStatus(r, OrderStatus.Success) && isDeposit(r),
    text: () => 'واریز به کیف ثروت با موفقیت انجام شد.',
  },
  withdrawSuccess: {
    when: (r) => hasStatus(r, OrderStatus.Success, OrderStatus.Completed) && isWithdraw(r),
    text: () => 'برداشت از کیف ثروت با موفقیت انجام شد.',
  },

  // Failed/Rejected/Completed/Requested/InProgress
  depositFailed: {
    when: (r) => hasStatus(r, OrderStatus.Failed, OrderStatus.Rejected) && isDeposit(r),
    text: () => 'واریز به کیف ثروت انجام نشد.',
  },
  withDrawFailed: {
    when: (r) => hasStatus(r, OrderStatus.Failed, OrderStatus.Rejected) && isWithdraw(r),
    text: () => 'برداشت از کیف ثروت انجام نشد.',
  },
  withdrawWaiting: {
    when: (r) => hasStatus(r, OrderStatus.Requested, OrderStatus.InProgress, OrderStatus.Waiting) && isWithdraw(r),
    text: () => 'برداشت از کیف ثروت در حال انجام است.',
  },

  // Deleted
  buyIpoDeleted: {
    when: (r) => hasStatus(r, OrderStatus.Deleted) && isBuy(r) && isIPO(r),
    text: () => 'درخواست خرید شما حذف شد',
  },
  buyDeleted: {
    when: (r) => hasStatus(r, OrderStatus.Deleted) && isBuy(r),
    text: () => 'درخواست سرمایه‌گذاری حذف شد',
  },
  sellDeleted: {
    when: (r) => hasStatus(r, OrderStatus.Deleted) && isSell(r),
    text: () => 'درخواست فروش حذف شد',
  },

  //   // SELL ETF
  sellETFSuccess: {
    when: (r) => isSell(r) && isETF(r) && r.status === OrderStatus.Approved,
    text: () => 'مبلغ حاصل از فروش به کیف پول صندوق‌های ETF شما واریز شده است.',
  },
  sellETFWaiting: {
    when: (r) => isSell(r) && isETF(r) && hasStatus(r, OrderStatus.Draft, OrderStatus.Waiting),
    text: () => 'می توانید مبلغ حاصل از فروش را از کیف پول ETF خود برداشت کنید.',
  },
} satisfies Record<string, CommonRule>;
