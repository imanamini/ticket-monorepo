import { BankCard } from '@client-monorepo/daily-fintech/bank-card';

export function buildCardShareText(card: BankCard | null): string {
  if (!card) return '';

  return [
    `شماره کارت: ${card.pan}`,
    `به‌نام: ${card.cardOwner}`,
    `بانک ${card.bankName}`,
    'کارت به کارت سریع‌تر با اپلیکیشن دیجی‌پی',
    'https://www.mydigipay.com/download : لینک دانلود',
  ].join('\n');
}
