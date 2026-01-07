import { Component, Inject, OnInit } from '@angular/core';
import { BlogClient } from '../../../../api/clients/blog-client';
import { BlogCategory, BlogPostCard } from '../../../../api/clients/models/content/blog-post';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { DownloadSectionData } from '../../../../api/clients/models/templates/download/download-data.response';
import { DOCUMENT, NgIf, NgFor } from '@angular/common';
import { JsonLDService } from '../../../../core/services/json-ld.service';
import { CategoryRecommendedPostsComponent } from './category-recommended-posts/category-recommended-posts.component';
import { CategoryRestPostsComponent } from './category-rest-posts/category-rest-posts.component';
import { DownloadAppLinkDirective } from '../../../../ui/ui-directive/download-app-link.directive';
import { UiBlogChildrenSwiperComponent } from '../../../../ui/ui-components/ui-blog/ui-blog-children-swiper/ui-blog-children-swiper.component';
import { UiBlogTopPostsComponent } from '../../../../ui/ui-components/ui-blog/ui-blog-top-posts/ui-blog-top-posts.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-blog-category',
  templateUrl: './blog-category.component.html',
  styleUrls: ['./blog-category.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    NgFor,
    UiBlogTopPostsComponent,
    UiBlogChildrenSwiperComponent,
    DownloadAppLinkDirective,
    CategoryRestPostsComponent,
    CategoryRecommendedPostsComponent,
  ],
})
export class BlogCategoryComponent implements OnInit {
  loaded = false;
  categoryLevel: 'parent' | 'child' = 'parent';
  displayBreadCrumbs = true;
  category: BlogCategory;
  posts: BlogPostCard[];
  recommendedPosts: BlogPostCard[];
  topPosts: BlogPostCard[];
  restPosts: BlogPostCard[];
  postCategories = [];
  slug = '';
  type = '';
  downloadApp: DownloadSectionData | undefined = undefined;

  constructor(
    private client: BlogClient,
    private activatedRoute: ActivatedRoute,
    private seo: SeoService,
    @Inject(DOCUMENT) private document: any,
    private jsonLDService: JsonLDService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((params) => {
      this.slug = params[0].path;
      this.getPosts();
    });
  }

  generateBreadCrumb() {
    if (this.category && this.category.parentId && typeof this.category.parent === 'object') {
      this.postCategories = [this.category.parent, this.category];
    } else if (this.category && !this.category.parent) {
      this.postCategories = [this.category];
    }
  }

  generateBreadCrumbSchema() {
    const entity = {
      '@type': 'BreadcrumbList',
      itemListElement: [],
    };

    const obj = [];
    let item = {
      '@type': 'ListItem',
      position: 1,
      name: 'مجله اینترنتی دیجی‌پی',
      item: this.document.location.origin + '/mag/',
    };
    obj.push(item);
    if (this.postCategories.length > 0) {
      this.postCategories.forEach(
        function (value, i) {
          item = {
            '@type': 'ListItem',
            position: i + 2,
            name: value.seoTitle ?? value.title,
            item: this.doc.location.origin + '/mag/' + value.slug + '/',
          };
          obj.push(item);
        },
        { doc: this.document },
      );
    }
    entity.itemListElement = obj;

    this.jsonLDService.insertSchema('custom', entity);
  }

  private getPosts() {
    this.client.getBlogPostsTagCategory(this.slug, 'category').subscribe((res) => {
      this.category = res.category;
      if (this.category.parentId && typeof this.category.parent === 'object') {
        this.categoryLevel = 'child';
      }
      this.generateBreadCrumb();
      this.generateBreadCrumbSchema();
      this.seo.setPageTitle(this.category?.seoTitle ?? this.category?.title);
      this.seo.setCanonical('https://www.mydigipay.com/mag/' + this.category?.slug + '/');
      this.recommendedPosts = res.recommendedPosts;
      this.posts = res.items;
      if (this.categoryLevel === 'parent') {
        if (this.posts.length > 7) {
          this.topPosts = this.posts.slice(0, 7);
          this.restPosts = this.posts.slice(7, 15);
        } else {
          this.topPosts = this.posts ?? [];
          this.restPosts = [];
        }
      } else {
        this.topPosts = [];
        this.restPosts = this.posts ?? [];
      }

      of('')
        .pipe(delay(500))
        .subscribe({
          next: () => {
            this.loaded = true;
          },
        });
    });
  }
}
