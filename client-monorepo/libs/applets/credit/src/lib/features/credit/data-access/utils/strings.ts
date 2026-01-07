export function fixWebViewHtml(html: string) {
  return html.replace('</head>', `<style>.row{margin-top: 20px !important;}</style></head>`);
}

export function fixActivityInfoArray(value: { [key: number]: any }) {
  if (Object.keys(value).length > 0) {
    const result: any[] = [];
    Object.keys(value).forEach((val, i) => {
      const key = Object.keys(value[i])[0];
      if (typeof key === 'undefined') {
        return;
      }
      let item: {};
      if (typeof value[i][key] === 'string') {
        // backward compatible pay result
        item = {
          key,
          value: value[i][key],
          copyable: false,
        };
      } else {
        item = {
          key,
          value: value[i][key].value,
          copyable: value[i][key].copyable,
        };
      }
      result.push(item);
    });
    return result;
  }

  return [];
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

/**
 * translate order to persian priority like اول، دوم ...
 * @param {number} order order should be greater than 0
 */
export function translateOrder(order: number): string {
  if (order < 1) {
    throw new RangeError('order should be greater than 0');
  }

  const map: { [key: number]: string } = {
    1: 'اول',
    2: 'دوم',
    3: 'سوم',
    4: 'چهارم',
    5: 'پنجم',
    6: 'ششم',
    7: 'هفتم',
    8: 'هشتم',
    9: 'نهم',
    10: 'دهم',
    11: 'یازدهم',
    12: 'دوازدهم',
    13: 'سیزدهم',
    14: 'چهاردهم',
    15: 'پانزدهم',
    16: 'شانزدهم',
    17: 'هفدهم',
    18: 'هجدهم',
    19: 'نوزدهم',
    20: 'بیستم',
  };

  if (order < 21) {
    return map[order];
  } else {
    return order + 'ام';
  }
}

/**
 * translate number to persian string like یک، دو ...
 * @param {number} number number should be greater than 0
 */
// tslint:disable-next-line:variable-name
export function translateNumberToPersianString(number: number): string {
  if (number < 1) {
    throw new RangeError('The number should be greater than 0');
  }

  const map: { [key: number]: string } = {
    1: 'یک',
    2: 'دو',
    3: 'سه',
    4: 'چهار',
    5: 'پنج',
    6: 'شش',
    7: 'هفت',
    8: 'هشت',
    9: 'نه',
    10: 'ده',
    11: 'یازده',
    12: 'دوازده',
    13: 'سیزده',
    14: 'چهارده',
    15: 'پانزده',
    16: 'شانزده',
    17: 'هفده',
    18: 'هجده',
    19: 'نوزده',
    20: 'بیست',
  };

  if (number < 21) {
    return map[number];
  }

  // Handle the case for numbers >= 21
  throw new RangeError('Number is out of range for translation');
}

export const AlphabetList: string[] = [
  'الف',
  'ب',
  'پ',
  'ت',
  'ث',
  'ج',
  'چ',
  'ح',
  'خ',
  'د',
  'ذ',
  'ر',
  'ز',
  'ژ',
  'س',
  'ش',
  'ص',
  'ض',
  'ط',
  'ظ',
  'ع',
  'غ',
  'ف',
  'ق',
  'ک',
  'گ',
  'ل',
  'م',
  'ن',
  'و',
  'ه',
  'ی',
];
