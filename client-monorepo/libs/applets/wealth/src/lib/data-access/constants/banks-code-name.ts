export const BanksCodeName = {
  '010': 'markazi',
  '011': 'sanat',
  '012': 'mellat',
  '013': 'refah',
  '014': 'maskan',
  '015': 'sepah',
  '016': 'keshavarzi',
  '017': 'melli',
  '018': 'tejarat',
  '019': 'saderat',
  '020': 'tosee-saderat',
  '021': 'postbank',
  '022': 'taavon',
  '051': 'tosee-saderat',
  '053': 'karafarin',
  '054': 'parsian',
  '055': 'eghtesad-novin',
  '056': 'saman',
  '057': 'passargad',
  '058': 'sarmayeh',
  '059': 'sina',
  '060': 'mehr-iran',
  '061': 'shahr',
  '062': 'ayandeh',
  '063': 'ansar',
  '064': 'gardeshgari',
  '065': 'hekmat',
  '066': 'day',
  '069': 'iranzamin',
  '070': 'resalat',
  '078': 'khavarmianeh',
};

export function ConvertBankName(shabaNumber: string): string {
  const normalizedIban = shabaNumber.replace(/\s|-/g, '');
  const reg = /^IR\d{2}(\d{3})\d{19}$/;
  const matchedString = normalizedIban.match(reg);
  if (matchedString) {
    return BanksCodeName[matchedString[1]];
  }
  return '';
}
