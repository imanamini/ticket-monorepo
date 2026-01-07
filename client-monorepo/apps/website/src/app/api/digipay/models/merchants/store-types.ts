export enum STORE_TYPES {
  ONSITE = 0,
  ONLINE = 1,
}

export const STORE_TYPES_LONG_TRANSLATION = {
  [STORE_TYPES.ONLINE]: 'آنلاین(خرید به صورت آنلاین)',
  [STORE_TYPES.ONSITE]: 'حضوری(مراجعه به فروشگاه)',
};

export const STORE_TYPES_SHORT_TRANSLATION = {
  [STORE_TYPES.ONLINE]: 'آنلاین',
  [STORE_TYPES.ONSITE]: 'حضوری',
};

export const STORE_TYPES_LINK_TRANSLATION = {
  [STORE_TYPES.ONLINE]: 'خرید اینترنتی',
  [STORE_TYPES.ONSITE]: 'وبسایت',
};
