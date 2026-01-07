import { Component, OnInit } from '@angular/core';
import { BlogClient } from '../../../../api/clients/blog-client';
import { BlogPost } from '../../../../api/clients/models/content/blog-post';
import { ActivatedRoute } from '@angular/router';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { NgFor, NgIf } from '@angular/common';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-blog-index',
  templateUrl: './blog-index.component.html',
  styleUrls: ['./blog-index.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, NgFor, BlogPostComponent, NgIf, UiButtonComponent],
})
export class BlogIndexComponent implements OnInit {
  posts: BlogPost[] = [];

  page = 1;

  totalPages = 1;

  loaded = false;

  constructor(
    private client: BlogClient,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['page']) {
        this.page = +params['page'];
        this.getPosts();
      } else {
        this.getPosts();
      }
    });
  }

  private getPosts() {
    this.client.getBlogPosts(this.page).subscribe((res) => {
      this.posts = res.items;
      this.page = res.currentPage;
      this.totalPages = res.totalPages;
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
