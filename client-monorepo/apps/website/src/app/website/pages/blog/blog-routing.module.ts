import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogSingleComponent } from './blog-single/blog-single.component';
import { BlogTagCategoryComponent } from './blog-tag-category/blog-tag-category.component';
import { BlogCategoryComponent } from './blog-category/blog-category.component';
import { BlogArchiveComponent } from './blog-archive/blog-archive.component';
import { BlogMainComponent } from './blog-main/blog-main.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: BlogMainComponent,
  },
  {
    path: 'archive',
    component: BlogArchiveComponent,
  },
  {
    path: 'archive/page/:page-idx-slug',
    component: BlogArchiveComponent,
  },
  {
    path: ':cat-slug',
    component: BlogCategoryComponent,
  },
  {
    path: ':cat-slug/:mag-slug',
    component: BlogSingleComponent,
  },
  {
    path: 'tag/:slug',
    component: BlogTagCategoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
