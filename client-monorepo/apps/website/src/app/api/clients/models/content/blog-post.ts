import { ApiFile } from '../common/api-file';
import { ApiDate } from '../common/api-date';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  lang: string;
  categoryId: string;
  tags: BlogTags[];
  seoTitle: string;
  seoKeywords: string;
  seoDescription: string;
  image: ApiFile;
  seoImage: ApiFile;
  excerpt: string;
  createdAt: ApiDate;
  updatedAt: ApiDate;
  createdAtAgo: string;
  updatedAtAgo: string;
  category: BlogCategory;
  content: string;
  seoNoIndex: boolean;
  canonical: string;
  pathPrefix: string;
  viewCount: number;
  readCount: number;
  readTime: number;
}

export interface BlogTags {
  name: string;
  slug: string;
  index_status: number;
}

export interface BlogCategory {
  id: string;
  icon?: ApiFile;
  title: string;
  seoTitle?: string;
  slug: string;
  parentId: string;
  parent: BlogCategory;
  indexStatus?: number;
  children?: BlogCategory[];
}

export interface BlogPostCard {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  image: ApiFile;
  seoImage: ApiFile;
  excerpt: string;
  createdAt: ApiDate;
  updatedAt: ApiDate;
  createdAtAgo: string;
  updatedAtAgo: string;
  category: BlogCategory;
  viewCount: number;
  readCount: number;
  commentCount?: number;
  type?: string;
}
