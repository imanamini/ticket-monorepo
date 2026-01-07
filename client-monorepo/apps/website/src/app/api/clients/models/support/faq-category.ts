import { ApiFile } from '../common/api-file';

export interface FaqCategory {
  id: string;
  name: string;
  icon: ApiFile;
  entriesCount: number;
  parentId: string;
  children: FaqCategory[];
}
