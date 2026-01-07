import { ApiFile } from '../../../clients/models/common/api-file';

export interface ArchiveFilters {
  categories: CategoryFilter[];
}

export interface CategoryFilter {
  id: string;
  title: string;
  icon: ApiFile;
  children: CategoryFilter[];
}
