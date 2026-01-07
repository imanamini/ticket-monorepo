const convertNonEnglishDigits = (input) => {
  const map = {
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

  if (!input) {
    return input;
  }

  const numbers = input.split('');
  for (let i = 0; i < numbers.length; i++) {
    if (map.hasOwnProperty(numbers[i].charCodeAt(0))) {
      numbers[i] = map[numbers[i].charCodeAt(0)];
    }
  }

  return numbers.join('');
};

const convertEnglishDigitsToPersian = (input) => {
  // make sure it is string
  input = '' + input;
  const map = {
    '0': '۰',
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
  };

  const numbers = input.split('');
  for (let i = 0; i < numbers.length; i++) {
    if (map.hasOwnProperty(numbers[i])) {
      numbers[i] = map[numbers[i]];
    }
  }

  return numbers.join('');
};

const convertObjectNumbersToEnglish = (obj: object) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'string') {
      obj[key] = convertNonEnglishDigits(obj[key]);
    }
  });

  return obj;
};

export function fixWebViewHtml(html) {
  return html.replace('</head>', `<style>.row{margin-top: 20px !important;}</style></head>`);
}

const priceFormat = (number, separator = '٬') => {
  if (typeof number !== 'string') {
    number = parseInt(number);
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

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
  return ((result <= 1 && result === checksum) || (result > 1 && checksum === 11 - result));
}

const numberToLetter = (number: number, maxConvertableNumber: number): number | string => {
  const numberToLetterMapper = {
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
  if (number > maxConvertableNumber) {
    return number;
  } else {
    return numberToLetterMapper[number];
  }
};

export const orderToLetters = (order: number, maxConvertableOrder: number = 20): string => {
  const orderToLetterMapper = {
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
  if (order > maxConvertableOrder) {
    return order + ' ام';
  } else {
    return orderToLetterMapper[order];
  }
};

const fixActivityInfoArray = (value: object) => {
  if (Object.keys(value).length > 0) {
    const result = [];
    Object.keys(value).forEach((val, i) => {
      const key = Object.keys(value[i])[0];
      if (typeof key === 'undefined') {
        return;
      }
      let item = {};
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
};

export {
  convertEnglishDigitsToPersian,
  convertNonEnglishDigits,
  convertObjectNumbersToEnglish,
  priceFormat,
  numberToLetter,
  fixActivityInfoArray
};
