import { IFilterItem } from './filter-item.interface';

export interface IFilters {
  title?: string;
  filters?: IFilterItem[];
  displayMode?: 'scroll' | 'bottomSheet';
}
