export const convertNonEnglishDigits = (input: string | number) => {
  const map: {
    [key: number]: string;
  } = {
    // arabic
    1632: '0',
    1633: '1',
    1634: '2',
    1635: '3',
    1636: '4',
    1637: '5',
    1638: '6',
    1639: '7',
    1640: '8',
    1641: '9',
    // persian
    1776: '0',
    1777: '1',
    1778: '2',
    1779: '3',
    1780: '4',
    1781: '5',
    1782: '6',
    1783: '7',
    1784: '8',
    1785: '9',
  };

  const numbers: string[] = ('' + input).split('');
  for (let i = 0; i < numbers.length; i++) {
    if (map.hasOwnProperty(numbers[i].charCodeAt(0))) {
      numbers[i] = map[numbers[i].charCodeAt(0)];
    }
  }

  return numbers.join('');
};
export const priceFormat = (input: number | string, separator = '٫') => {
  if (!input) {
    return '';
  }
  const num: number = typeof input === 'string' ? parseInt(input, 10) : input;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

export function fixWebViewHtml(html) {
  return html.replace('</head>', `<style>.row{margin-top: 20px !important;}</style></head>`);
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
