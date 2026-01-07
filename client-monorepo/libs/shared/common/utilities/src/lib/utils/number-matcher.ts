import { convertNonEnglishDigits } from '@digipay/strings';

export function numberMatcher(event: KeyboardEvent): boolean {
  const allowedRegex = /[0-9]/g;
  if (!(convertNonEnglishDigits(event.key)?.match(allowedRegex) || event.key === 'Backspace' || event.code === 'key')) {
    event.preventDefault();
    return false;
  }
  return true;
}
