import { Tag } from '../content/Tag';
import { BlogCategory, BlogPostCard } from '../content/blog-post';

export interface PaginatedResponse<T> {
  items: T[];
  perPage: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  tag: Tag;
  category: BlogCategory;
  recommendedPosts?: BlogPostCard[];
}
