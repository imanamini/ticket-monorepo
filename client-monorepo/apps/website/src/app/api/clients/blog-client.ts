import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../base-http-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostsResponse } from './models/templates/blog/posts.response';
import { BlogCategory, BlogPost, BlogPostCard } from './models/content/blog-post';
import { UserComment } from './models/content/comment';
import { BaseResponse } from './models/base.response';

@Injectable({
  providedIn: 'root',
})
export class BlogClient extends BaseHttpClient {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getBlogPosts(page: number): Observable<PostsResponse> {
    return super.get('/api/website/posts', {
      page,
    });
  }

  getBlogMainPage(): Observable<{
    recentPosts: BlogPostCard[];
    categories: BlogCategory[];
    swiperOptions: BlogCategory[];
    sections: any;
  }> {
    return super.get('/api/website/mag');
  }

  getBlogPostsTagCategory(slug: string, type: string): Observable<PostsResponse> {
    return super.get(`/api/website/posts/?${type}=${slug}&perPage=15`);
  }

  getPostBySlug(slug: string): Observable<{
    post: BlogPost;
    comments: UserComment[];
  }> {
    return super.get('/api/website/post', {
      slug,
    });
  }

  getPostByCategorySlug(
    category: string,
    perPage: number,
  ): Observable<{
    items: BlogPost[];
  }> {
    return super.get('/api/website/posts/category', {
      category,
      perPage,
    });
  }

  submitCommentForPost(postId: string, body: any): Observable<BaseResponse> {
    body.entityType = 'POST';
    body.entityId = postId;
    return super.post('/api/content/user/comment', body);
  }

  getArchiveData(categoryId: string, perPage: number, page: number) {
    return super.get('website/posts/archive', {
      page: page,
      perPage: perPage,
      categoryId: categoryId,
    });
  }

  getArchiveFilters() {
    return super.get('website/posts/archive/filters');
  }
}
