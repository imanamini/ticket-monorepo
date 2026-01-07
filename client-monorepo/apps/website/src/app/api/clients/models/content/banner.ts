import { ApiFile } from '../common/api-file';

export interface Banner {
  id: string;
  imageDesktop: ApiFile;
  imageMobile: ApiFile;
  link: string;
  title: string;
}
