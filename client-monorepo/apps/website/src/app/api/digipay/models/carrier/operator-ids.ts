export enum OperatorIds {
  MCI = '1',
  MTN = '2',
  RIGHTEL = '3',
}

export const OPERATOR_TRANSLATIONS = {
  [OperatorIds.MTN]: 'ایرانسل',
  [OperatorIds.MCI]: 'همراه‌اول',
  [OperatorIds.RIGHTEL]: 'رایتل',
};

export const OPERATOR_IMAGE_IDS = {
  [OperatorIds.MTN]: 'MTN',
  [OperatorIds.MCI]: 'MCI',
  [OperatorIds.RIGHTEL]: 'RIGHTEL',
};
