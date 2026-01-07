import { FormControl } from '@angular/forms';

export function invalidNationalCode(formControl: FormControl) {
  const allDigitEqual = [
    '0000000000',
    '1111111111',
    '2222222222',
    '3333333333',
    '4444444444',
    '5555555555',
    '6666666666',
    '7777777777',
    '8888888888',
    '9999999999'];
  const nationalCode = formControl.value;
  const errorResult = {invalidNationalCode: true};

  if (nationalCode && (nationalCode.length < 10)) {
    return errorResult;
  }
  if (allDigitEqual.includes(nationalCode)) {
    return errorResult;
  }
  return nationalCodeAlgorithm(nationalCode) ? null : {invalidNationalCode: true};
}

function nationalCodeAlgorithm(nationalCode): boolean {
  if (!nationalCode) {
    return false;
  }
  let sum = 0;
  const length = 10;

  for (let i = 0; i < length - 1; i++) {
    sum += Number(nationalCode.charAt(i)) * (length - i);
  }

  const eighthCharacter = Number(nationalCode.charAt(9));
  const remaining = sum % 11;
  return (((remaining < 2) && (eighthCharacter === remaining)) || ((remaining >= 2) && ((11 - remaining) === eighthCharacter)));
}
