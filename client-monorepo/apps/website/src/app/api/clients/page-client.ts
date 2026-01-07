import { BaseHttpClient } from '../base-http-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from './models/content/page';
import { ServicePageTemplate } from './models/templates/services/service-page-template';
import { BlogPost } from './models/content/blog-post';

@Injectable({
  providedIn: 'root',
})
export class PageClient extends BaseHttpClient {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getPage(
    prefix: string,
    slug: string,
  ): Observable<{
    page: Page<any>;
    contactForms: Array<any>;
    posts: BlogPost[];
    digikalaProducts: any;
    digikalaCategoriesProducts: any;
  }> {
    return super.get(`/api/website/page/${prefix}/${slug}`);
  }

  getServicePage(slug: string): Observable<{
    page: Page<ServicePageTemplate>;
    posts: BlogPost[];
  }> {
    return this.getPage('services', slug);
  }

  getCreditProductPage(slug: string): Observable<{
    page: Page<any>;
    posts: BlogPost[];
    digikalaProducts: any;
    digikalaCategoriesProducts: any;
  }> {
    return this.getPage('credit', slug);
  }

  checkRedirection(path: string): Observable<{
    redirectTo: string;
    statusCode: number;
  }> {
    path = decodeURI(path);
    return super.post('/api/website/redirection/check', {
      path,
    });
  }
}
