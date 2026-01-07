import {convertNonEnglishDigits} from '@digipay/strings';

const getNumFromString = (str: string) => {
  return str.match(/[0-9]/gim)?.join('') || '';
};

export const parseFaNum = (str) => {
  const s = getNumFromString(convertNonEnglishDigits(str));

  if (!s.length) {
    return 0;
  }

  return Number(s);
};
