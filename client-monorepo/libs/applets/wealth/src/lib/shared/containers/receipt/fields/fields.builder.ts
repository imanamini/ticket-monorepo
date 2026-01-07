import { ActivityInfo } from '@digipay/ngx-payment-result/lib/model/payment-result.model';
import { price, time, confirmationTime, fundKind, transactionArea, ipoPaymentMethod, receiptNumberLabel } from '../utils/format';
import {
  isCrowd,
  isIPO,
  isProfitOrOverplus,
  isWalletDeposit,
  isWalletWithdraw,
  hasStatus,
  isPending,
  isWithdraw,
} from '../utils/predicates';
import { OrderStatus } from '../../../../data-access/enums/order-status';
import { IReceipt } from '../../../../data-access/models/receipt.interface';

export class FieldsBuilder {
  private readonly items: ActivityInfo[] = [];
  constructor(private readonly r: IReceipt) {}

  add(key: string, value: string, copyable = false) {
    if (!key) return this;
    this.items.push({ key, value, copyable });
    return this;
  }

  addIf(cond: boolean, key: string, value: string, copyable = false) {
    if (cond) this.add(key, value, copyable);
    return this;
  }

  addETFBreakdown() {
    const b = this.r.paidAmountBreakdown;
    if (!b) return this;
    if (b.ipg > 0) this.add('پرداخت مستقیم', price(b.ipg));
    if (b.wallet > 0) this.add('برداشت از کیف پول ETF', price(b.wallet));
    return this;
  }

  build(): ActivityInfo[] {
    return this.items;
  }
}

export function buildFields(r: IReceipt, message: string): ActivityInfo[] {
  // Wallet instrument
  if (r.instrumentType === 'Wallet') {
    return new FieldsBuilder(r)
      .add('زمان ثبت درخواست', time(r))
      .add(receiptNumberLabel(r), r.receiptNumber, true)
      .add('توضیحات', message)
      .build();
  }

  // IPO
  if (isIPO(r)) {
    return new FieldsBuilder(r)
      .add('نوع سرمایه‌گذاری', `عرضه اولیه ${r.instrumentName}`)
      .add('تعداد سهم', r.units > 0 ? `${r.units} سهم` : 'در حال بررسی')
      .add('زمان ثبت درخواست', time(r))
      .add(
        (() => {
          switch (r.status) {
            case OrderStatus.Deleted:
            case OrderStatus.RejectedByManager:
            case OrderStatus.RejectedBySystem:
              return 'زمان حذف درخواست';
            case OrderStatus.Approved:
              return 'زمان خرید';
            default:
              return '';
          }
        })(),
        confirmationTime(r),
      )
      .add('نوع پرداخت', ipoPaymentMethod(r))
      .add('محل تراکنش', transactionArea(r))
      .add(receiptNumberLabel(r), r.receiptNumber, true)
      .add('توضیحات', message)
      .build();
  }

  // Crowd
  if (isCrowd(r)) {
    return new FieldsBuilder(r)
      .add('نوع سرمایه‌گذاری', 'تامین مالی جمعی')
      .add('نام طرح', r.instrumentName)
      .add('زمان', time(r))
      .add('محل تراکنش', transactionArea(r))
      .add('کد رهگیری', r.receiptNumber, true)
      .add('توضیحات', message)
      .build();
  }

  // Wallet withdraw/deposit
  if (isWalletWithdraw(r)) {
    return new FieldsBuilder(r)
      .add('برداشت از', 'کیف پول صندوق‌های ETF')
      .add('زمان', time(r))
      .add('کد رهگیری', r.receiptNumber, true)
      .add('توضیحات', message)
      .build();
  }

  if (isWalletDeposit(r)) {
    return new FieldsBuilder(r)
      .add('واریز به', 'کیف پول صندوق‌های ETF')
      .add('زمان', time(r))
      .add('کد رهگیری', r.receiptNumber, true)
      .add('توضیحات', message)
      .build();
  }

  if (r.instrumentType === 'Wallet_FixIncome' || r.instrumentType === 'Wallet_Gold') {
    return new FieldsBuilder(r)
      .add('زمان', time(r))
      .add('کد رهگیری', r.receiptNumber || r.trackingCode, true)
      .addIf(!isPending(r) && !isWithdraw(r), 'نوع سرمایه‌گذاری', r.instrumentName + ' کیف ثروت')
      .addIf(r.commission?.length > 0, 'کارمزد', `${r.commission} ریال`)
      .build();
  }

  // Common mutual funds + extras
  const fb = new FieldsBuilder(r).add('نام صندوق', r.instrumentName);
  fb.add('نوع صندوق', fundKind(r));
  fb.add('زمان', time(r));

  if (isProfitOrOverplus(r)) {
    fb.addETFBreakdown().add('توضیحات', message);
    return fb.build();
  }

  if (hasStatus(r, OrderStatus.Draft, OrderStatus.Waiting, OrderStatus.RejectedByManager, OrderStatus.RejectedBySystem)) {
    fb.addETFBreakdown().add('محل تراکنش', transactionArea(r)).add('کد رهگیری', r.receiptNumber, true).add('توضیحات', message);
    return fb.build();
  }

  // Default
  if (r.investmentType !== 'ETF' && r.units) {
    fb.addIf(true, 'تعداد واحد', r?.units?.toString() ?? '');
  }
  fb.addETFBreakdown().add('محل تراکنش', transactionArea(r)).add('کد رهگیری', r.receiptNumber, true).add('توضیحات', message);

  return fb.build();
}
