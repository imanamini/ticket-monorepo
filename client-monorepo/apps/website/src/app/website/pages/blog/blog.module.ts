import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogIndexComponent } from './blog-index/blog-index.component';
import { BlogPostComponent } from './blog-index/blog-post/blog-post.component';

import { LayoutModule } from '../../layout/layout.module';
import { BlogSingleComponent } from './blog-single/blog-single.component';

import { BlogTagCategoryComponent } from './blog-tag-category/blog-tag-category.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { BlogCategoryComponent } from './blog-category/blog-category.component';
import { CategoryRestPostsComponent } from './blog-category/category-rest-posts/category-rest-posts.component';
// import { SwiperModule } from 'swiper/angular';
import {
  CategoryRecommendedPostsComponent
} from './blog-category/category-recommended-posts/category-recommended-posts.component';
import { BlogArchiveComponent } from './blog-archive/blog-archive.component';
import { UiDialogFilterComponent } from './blog-archive/ui-dialog-filter/ui-dialog-filter.component';
import {
  BlogArchivePaginationComponent
} from './blog-archive/blog-archive-pagination/blog-archive-pagination.component';

import { CategoryFilterComponent } from './blog-archive/category-filter/category-filter.component';
import {
  SingleCategoryFilterComponent
} from './blog-archive/category-filter/single-category-filter/single-category-filter.component';
import { BlogMainComponent } from './blog-main/blog-main.component';

import { UiRecommendationModule } from '../../../ui/ui-components/ui-recommendation/ui-recommendation.module';

import { DownloadAppLinkDirective } from '../../../ui/ui-directive/download-app-link.directive';

@NgModule({
  imports: [
    CommonModule,
    BlogRoutingModule,
    LayoutModule,
    NgOptimizedImage,
    PipesModule,
    UiRecommendationModule,
    UiRecommendationModule,
    DownloadAppLinkDirective,
    BlogIndexComponent,
    BlogPostComponent,
    BlogSingleComponent,
    BlogTagCategoryComponent,
    BlogCategoryComponent,
    CategoryRestPostsComponent,
    CategoryRecommendedPostsComponent,
    BlogArchiveComponent,
    UiDialogFilterComponent,
    BlogArchivePaginationComponent,
    CategoryFilterComponent,
    SingleCategoryFilterComponent,
    CategoryRecommendedPostsComponent,
    BlogMainComponent,
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BlogModule {}
