import { SWAP_CONFIRM, SWAP_LANDING, SWAP_RESULT } from '../../../data-access/constants/app-routes';

export const SWAP_PAGES_ROUTE_MAP: Record<string, string> = {
  page_wallet_swap_landing: SWAP_LANDING,
  page_wallet_swap_confirm: SWAP_CONFIRM,
  page_wallet_swap_receipt: SWAP_RESULT,
};
