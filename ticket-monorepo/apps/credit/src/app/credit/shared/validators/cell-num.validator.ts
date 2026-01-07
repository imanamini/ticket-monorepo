import { AbstractControl } from '@angular/forms';
import { convertNonEnglishDigits } from '../../../utils/strings';

export function ValidateCellNum(control: AbstractControl) {

  let value = control.value;
  if (value) {
    value = convertNonEnglishDigits(value);
  }

  const valid = /^09\d{9}$/.test(value);
  return valid ? null : {cellNumber: {valid: false, value: value}};
}
