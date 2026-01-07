import { MerchantCashbackList } from '@client-monorepo/common/subscription';

export function concatStoreNames(merchantLists: MerchantCashbackList[]): string {
  return merchantLists.map((merchant: MerchantCashbackList) => merchant.businessTitle).join('، ');
}
