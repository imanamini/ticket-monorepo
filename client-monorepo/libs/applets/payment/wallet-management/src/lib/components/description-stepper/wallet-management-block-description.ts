import { SeparateThousandsPipe } from '@digipay/ng-lib-pipes';

export const BLOCK_DESCRIPTION = (amount: number) => [
  `مبلغ ${new SeparateThousandsPipe().transform(
    amount,
  )} ریال از موجودی کیف‌پول شما مسدود شده و قابل استفاده نیست. برای اطلاعات بیش‌تر با پشتیبانی تماس بگیرید.`,
];
