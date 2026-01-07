export const convertNonEnglishDigits = (input: string | number) => {
  const map: {[key: number]: string} = {
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
  const num: number = (typeof input === 'string') ? parseInt(input, 10) : input;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};
