import { Component, OnInit } from '@angular/core';
import { BlogClient } from '../../../../api/clients/blog-client';
import { SeoService } from '../../../services/seo.service';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from '../../../../api/clients/models/content/blog-post';
import { NgFor } from '@angular/common';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';
import { BlogPostComponent } from '../blog-index/blog-post/blog-post.component';

@Component({
  selector: 'app-blog-tag-category',
  templateUrl: './blog-tag-category.component.html',
  styleUrls: ['./blog-tag-category.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, NgFor, BlogPostComponent],
})
export class BlogTagCategoryComponent implements OnInit {
  posts: BlogPost[] = [];

  slug = '';

  type = '';

  loaded = false;

  constructor(
    private client: BlogClient,
    private seo: SeoService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((params) => {
      this.type = params[0].path;
      this.slug = params[1].path;
      this.getPosts();
    });
  }

  private getPosts() {
    this.client.getBlogPostsTagCategory(this.slug, this.type).subscribe((res) => {
      this.posts = res.items;
      if (res.tag?.indexStatus === 0 || res.category?.indexStatus === 0) {
        this.seo.setMetaTag({ name: 'robots', content: 'noindex, nofollow' });
      } else if (res.tag?.indexStatus === 1 || res.category?.indexStatus === 1) {
        this.seo.setMetaTag({
          name: 'robots',
          content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        });
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
