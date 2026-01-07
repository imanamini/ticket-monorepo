import { AbstractControl } from '@angular/forms';

export function NationalIdValidator(control: AbstractControl) {
  const input = control.value;
  const invalidObject = {
    invalidNationalId: { valid: false, value: control.value },
  };

  if (
    !/^\d{10}$/.test(input) ||
    input === '0000000000' ||
    input === '1111111111' ||
    input === '2222222222' ||
    input === '3333333333' ||
    input === '4444444444' ||
    input === '5555555555' ||
    input === '6666666666' ||
    input === '7777777777' ||
    input === '8888888888' ||
    input === '9999999999'
  )
    return invalidObject;

  const check = parseInt(input[9], 10);
  let sum = 0;
  let i;
  for (i = 0; i < 9; ++i) {
    sum += parseInt(input[i], 10) * (10 - i);
  }
  sum %= 11;
  const state = (sum < 2 && check === sum) || (sum >= 2 && check + sum === 11);
  return state ? true : invalidObject;
}

export function validateNationalCode(nationalCode: string): boolean {
  if (!nationalCode || nationalCode.length !== 10) {
    return false;
  }
  if (parseInt(nationalCode.substr(3, 6), 10) === 0) {
    return false;
  }
  const checksum = +nationalCode.substr(9, 1);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(nationalCode.substr(i, 1), 10) * (10 - i);
  }
  const result = sum % 11;
  return (result <= 1 && result === checksum) || (result > 1 && checksum === 11 - result);
}
