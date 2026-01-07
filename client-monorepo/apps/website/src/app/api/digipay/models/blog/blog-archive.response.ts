import { BlogPost } from '../../../clients/models/content/blog-post';

export interface BlogArchiveResponse {
  currentPage: number;
  items: BlogPost[];
  perPage: number;
  totalItems: number;
  totalPages: number;
}
