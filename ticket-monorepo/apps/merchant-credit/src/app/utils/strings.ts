export const convertNonEnglishDigits = (number: any) => {
  let map: any = {
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
export const priceFormat = (input: number | string, separator = '٫') => {
  const number: number = (typeof input === 'string') ? parseInt(input, 10) : input;
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

export function fixWebViewHtml(html: string): string {
  return html.replace('</head>', `<style>.row{margin-top: 20px !important;}</style></head>`);
}

export function fixActivityInfoArray(value: any): any[] {
  if (Object.keys(value).length > 0) {
    const result: any[] = [];
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
}
