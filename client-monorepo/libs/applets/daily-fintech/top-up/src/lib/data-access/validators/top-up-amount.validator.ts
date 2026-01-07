import { AbstractControl, ValidatorFn } from '@angular/forms';
import { convertNonEnglishDigits } from '@digipay/strings';

export function TopUpAmount(min: number, max: number, factor: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let val = control.value;

    // Guard against null/undefined/empty values
    if (!val || val === '') {
      return null;
    }

    val = convertNonEnglishDigits(val);
    val = val.replace(/[^\d]/g, '');

    if (val % factor !== 0) {
      return { invalidMultiple: true };
    }
    if (val < min || val > max) {
      return { invalidAmount: true };
    }

    return null;
  };
}
