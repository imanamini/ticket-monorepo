import { ApiFile } from '../../common/api-file';

export interface SimilarService {
  title: string;
  subtitle: string;
  items: Array<{
    icon: ApiFile;
    backgroundColor: string;
    title: string;
    description: string;
    link: string;
  }>;
}
