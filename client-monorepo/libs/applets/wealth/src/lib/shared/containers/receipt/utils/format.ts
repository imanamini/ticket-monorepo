import { SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import { IReceipt } from '../../../../data-access/models/receipt.interface';

const sep = new SeparateThousandsPipe();

export const price = (v: number) => `${sep.transform(v)} ریال`;

export const time = (r: IReceipt) => `${r.date}${r.time ? ' - ' + r.time : ''}`;

export const confirmationTime = (r: IReceipt) => `${r.confirmationDate ?? ''}${r.confirmationTime ? ' - ' + r.confirmationTime : ''}`;

export const fundKind = (r: IReceipt) =>
  r.instrumentType === 'FixedIncome' ? 'درآمد ثابت' : r.instrumentType === 'Gold' ? 'مبتنی بر طلا' : 'سهامی';

export const transactionArea = (r: IReceipt) => (r.isTradePlaceInternal ? 'دیجی‌پی' : 'خارج از دیجی‌پی');

export const ipoPaymentMethod = (r: IReceipt) => (r.ipoPaymentMethod === 'ByCredit' ? 'اعتبار کارگزاری' : 'درگاه بانکی');

export const receiptNumberLabel = (r: IReceipt) =>
  (['Draft', 'Waiting', 'Deleted'] as string[]).includes(r.status as any) ? 'شماره درخواست' : 'کد رهگیری';
