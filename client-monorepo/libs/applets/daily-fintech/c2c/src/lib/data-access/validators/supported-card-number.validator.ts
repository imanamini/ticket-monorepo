import { AbstractControl } from '@angular/forms';
import { convertNonEnglishDigits } from '@digipay/strings';
import { Bank } from '@client-monorepo/daily-fintech/bank-card';

export const bankCardNumberValidator =
  (list: Bank[], type?: 'DESTINATION' | 'SOURCE') =>
  (
    control: AbstractControl,
  ): null | {
    bankCardNumberValidator: 'invalid-card-number' | 'not-support-bank';
  } => {
    let value = convertNonEnglishDigits(control.value || '');
    if (value.indexOf('-') >= 0) {
      value = value.replace(/-/gi, '');
    }
    if (value.length < 6) {
      return null;
    }

    const prefix = value.substr(0, 6);
    const bankWithThePrefix = list.filter((b) => b.cardPrefixes.indexOf(prefix) >= 0);
    const isSupported = bankWithThePrefix.length > 0;
    const isNotActiveBank = bankWithThePrefix.length > 0 && bankWithThePrefix[0].active === false;

    if (!isSupported) {
      return { bankCardNumberValidator: 'invalid-card-number' };
    }
    if (isNotActiveBank && type === 'SOURCE') {
      return { bankCardNumberValidator: 'not-support-bank' };
    }
    return null;
  };
