const convertNonEnglishDigits = (number) => {
  let map = {
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

  let numbers = number.split('');
  for (let i = 0; i < numbers.length; i++) {
    if (map.hasOwnProperty(numbers[i].charCodeAt(0))) {
      numbers[i] = map[numbers[i].charCodeAt(0)];
    }
  }

  return numbers.join('');
};

const convertEnglishDigitsToPersian = (string) => {
  // make sure it is string
  string = '' + string;
  let map = {
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

  let numbers = string.split('');
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

const priceFormat = (number, separator = '٫') => {
  if (typeof number !== 'string') {
    number = parseInt(number);
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

export {
  convertEnglishDigitsToPersian,
  convertNonEnglishDigits,
  convertObjectNumbersToEnglish,
  priceFormat,
};
