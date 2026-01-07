import { ValidatorFn, AbstractControl } from '@angular/forms';
import { convertNonEnglishDigits } from '@digipay/strings';
import { RangeNumber } from '../models/range-number.model';

// custom validator to check that input number is PrePaid
export function RangeValidator(control: AbstractControl, range: RangeNumber): ValidatorFn {

  return (control: AbstractControl): { [key: string]: any } | null => {

    let input = control.value;

    if (typeof input === 'string' && input) {
      input = parseInt(convertNonEnglishDigits(input).replace(/[^\d]/g, ''));
    }

    const isInValid = !(input && +input <= range.max && +input >= range.min);

    return isInValid ? { inInRange: { value: 'Invalid' } } : null;
  };
}
