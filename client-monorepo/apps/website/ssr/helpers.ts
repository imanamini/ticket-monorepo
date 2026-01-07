import { MOBILES_RE } from './user-agent-constants';

export const isMobile = (userAgent: string): boolean => {
  // if (this.isTablet(userAgent)) {
  //   return false;
  // }
  const match = Object.keys(MOBILES_RE).find((mobile) => {
    return test(userAgent, MOBILES_RE[mobile]);
  });
  return !!match;
};

const test = (str: string, regex: any): any => {
  if (typeof regex === 'string') {
    regex = new RegExp(regex);
  }

  if (regex instanceof RegExp) {
    return regex.test(str);
  } else if (regex && Array.isArray(regex.and)) {
    return regex.and.every((item: any) => {
      return test(str, item);
    });
  } else if (regex && Array.isArray(regex.or)) {
    return regex.or.some((item: any) => {
      return test(str, item);
    });
  } else if (regex && regex.not) {
    return !test(str, regex.not);
  } else {
    return false;
  }
};
