import { GenericApiResponse } from '@client-monorepo/common/network';

export interface SearchSuggestionApiResponseInterface extends GenericApiResponse {
  topQuerySuggestions: Array<string>;
  topQuerySuggestionsByCategory: Array<suggestionByCategoryItem>;
}

export interface suggestionByCategoryItem {
  docCount: number;
  query: string;
  category: string;
}
