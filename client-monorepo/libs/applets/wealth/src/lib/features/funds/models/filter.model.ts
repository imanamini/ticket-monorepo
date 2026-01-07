import { SortDirection } from '../funds-list/models/sort-direction.enum';

export interface FilterModel<T> {
  Column?: T;
  SortDirection?: SortDirection;
  status?: string | string[];
}
