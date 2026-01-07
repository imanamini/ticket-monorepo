import { GenericApiResponse } from '@client-monorepo/common/network';

export interface SearchPrizesResponse extends GenericApiResponse {
  searchResultList: SearchResult[];
}

export interface SearchResult {
  clubPrizeName: string;
  clubPrizeDate: number;
  maskedCellNumber: string;
}
