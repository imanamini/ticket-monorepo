import { MerchantCashbackList, PAYMENT_TYPE } from '@client-monorepo/common/subscription';
import { formatPriceToString } from '@client-monorepo/common/utilities';

export function generateManagementDescription(merchantCashback: MerchantCashbackList[]): string {
  let finalText = 'برگشت ‌پول تا سقف ';
  switch (merchantCashback[0].amountType) {
    case PAYMENT_TYPE.FIX_AMOUNT:
      finalText += `${formatPriceToString(+merchantCashback[0].amount)} به ازای هر خرید`;
      break;
    case PAYMENT_TYPE.FIXED_PERCENTAGE:
      finalText += `${merchantCashback[0].amount}٪ مبلغ خرید `;
      break;
  }
  return finalText;
}
