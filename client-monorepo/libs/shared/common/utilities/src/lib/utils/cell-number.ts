import { MobileOperator } from '../data-access/models/mobile-operator.model';

const mobileTypeCheck = (cellNumber: string, operators: Array<MobileOperator>, type: number) => {
  const prefix = getCellNumberPrefix(cellNumber, 4);
  const prefix2 = getCellNumberPrefix(cellNumber, 5);

  const result = operators.filter((o) => o.prefixes.some((p) => (p.value === prefix || p.value === prefix2) && p.types.indexOf(type) >= 0));

  return result.length != 0;
};

const isPrePaidCellNumber = (cellNumber: string, operators: Array<MobileOperator>): boolean => {
  return mobileTypeCheck(cellNumber, operators, 2);
};

const isPostPaidCellNumber = (cellNumber: string, operators: Array<MobileOperator>): boolean => {
  return mobileTypeCheck(cellNumber, operators, 1);
};

const getCellNumberPrefix = (cellNumber: string, length = 4) => {
  return cellNumber.substr(0, length);
};

const cellNumberFormatter = (cellNumber: string): string => {
  return cellNumber.replace('+98', '0').replace('98', '0').replace(/ /g, '');
};

export { getCellNumberPrefix, isPrePaidCellNumber, isPostPaidCellNumber, cellNumberFormatter };
