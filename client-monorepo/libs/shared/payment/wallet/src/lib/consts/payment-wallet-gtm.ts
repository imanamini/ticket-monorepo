export enum WALLET_GTM_TAG {
  WALLET_INFO = 'WM_info',
  GIFT_MNG_SEARCH = 'WM_gift_search',
  WALLET_MNG_CAMERA = 'WM_camera',
  WALLET_MNG_GIFT = 'WM_gift',
  WALLET_MNG_CASHIN = 'WM_CashIn',
  WALLET_MNG_CASHOUT = 'WM_chahout',
  CASHOUT_CARD = 'cashout_card',
  CASHOUT_CARD_TOTAL_BALANCE = 'cashout_wholeBalance',
  CASHOUT_CARD_CONTINUE = 'cashout_continue',
  CASHOUT_CARD_PURCHASE = 'cashout_purchase',
  CASHOUT_CARD_CANCEL = 'card_cancel',
  CASHOUT_NEW_CARD = 'card_NewCard',
  CASHOUT_TRANSFER = 'cashout_transfer',
  CASHOUT_TRANSFER_ADD_PHONE = 'transfer_addPhone',
  CASHOUT_TRANSFER_ADD_FRIENDS = 'transfer_addFriends',
  CASHOUT_TRANSFER_PURCHASE = 'transfer_purchase',
  CASHOUT_TRANSFER_AMOUNT = 'transfer_addAmount',
  CASHIN_GIFT = 'cashin_gift',
  CASHIN_PURCHASE = 'cashin_purchase',
  CASHIN_INFO = 'cashin_info',
  CASHIN_AMOUNT = 'cashin_amount',
  CASHIN_BACK = 'cashin_back',
  CASHIN_GIFT_SEARCH = 'cashin_gift_search',
}

const PILLAR_PREFIX = 'PILLAR_';

export const convertWalletGtmToPillar = (event: WALLET_GTM_TAG | string ): string => `${PILLAR_PREFIX}${event}`;
