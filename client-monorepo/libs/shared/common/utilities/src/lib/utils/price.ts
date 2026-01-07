import { numberToString } from '@digipay/strings';

export function formatPriceToString(amount: number, hasRangeAmount = false): string {
  let formattedAmount = '';
  if (!amount) {
    return formattedAmount;
  }
  amount /= 10;
  const main = Math.floor(amount);
  const decimal = Number((amount - main).toFixed(2));
  const rial = decimal.toString().split('.')[1];
  formattedAmount = numberToString(main) + ' ' + 'تومان';
  if (rial && rial !== '0') {
    formattedAmount += ' و ' + rial + ' ریال ';
  }
  if (hasRangeAmount) {
    formattedAmount = 'تا ' + formattedAmount;
  }
  return formattedAmount;
}
