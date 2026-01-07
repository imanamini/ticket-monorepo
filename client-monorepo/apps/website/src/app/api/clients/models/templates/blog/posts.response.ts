import { PaginatedResponse } from '../../common/paginated.response';
import { BlogPost } from '../../content/blog-post';

export type PostsResponse = PaginatedResponse<BlogPost>;
