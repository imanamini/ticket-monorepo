export function validateNationalId(nationalCode: string): boolean {
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

export function isValidIBANNumber(input: any): boolean {
  const iban = String(input)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  // match and capture (1) the country code, (2) the check digits, and (3) the rest
  const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);

  // check syntax and length
  if (!code || iban.length !== 26) {
    return false;
  }
  // rearrange country code and check digits, and convert chars to ints
  const digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, (letter) => {
    return String(letter.charCodeAt(0) - 55);
  });
  // final check
  return mod97(digits) === 1;
}

function mod97(input: string) {
  let checksum = parseInt(input.slice(0, 2), 10);
  let fragment;
  for (let offset = 2; offset < input.length; offset += 7) {
    fragment = String(checksum) + input.substring(offset, offset + 7);
    checksum = parseInt(fragment, 10) % 97;
  }
  return checksum;
}

export function convertTimestampToDate(input: number): string {
  const date = new Date(input);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp');
  }
  return date.toUTCString();
}
