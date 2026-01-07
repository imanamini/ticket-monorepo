import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BlogCategory, BlogPostCard } from '../../../../api/clients/models/content/blog-post';
import { UiBlogMobilePostCardComponent } from '../ui-blog-mobile-post-card/ui-blog-mobile-post-card.component';
import { UiBlogVerticalPostCardComponent } from '../ui-blog-vertical-post-card/ui-blog-vertical-post-card.component';
import { UiBlogHorizontalPostCardComponent } from '../ui-blog-horizontal-post-card/ui-blog-horizontal-post-card.component';
import { UiBlogSquarePostCardComponent } from '../ui-blog-square-post-card/ui-blog-square-post-card.component';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { NgSwitch, NgSwitchCase, NgClass, NgIf, NgOptimizedImage, NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-blog-posts-preview',
  templateUrl: './ui-blog-posts-preview.component.html',
  styleUrls: ['./ui-blog-posts-preview.component.scss'],
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgClass,
    NgIf,
    UiButtonComponent,
    NgOptimizedImage,
    UiBlogSquarePostCardComponent,
    NgFor,
    UiBlogHorizontalPostCardComponent,
    UiBlogVerticalPostCardComponent,
    UiBlogMobilePostCardComponent,
  ],
})
export class UiBlogPostsPreviewComponent implements OnChanges {
  @Input()
  type: 'HORIZONTAL-CARDS-COLLECTION' | 'SINGLE-SQUARE-DETAILED-COLLECTION' | 'VERTICAL-CARDS-COLLECTION' | 'ACADEMY';
  @Input()
  containerBackGround: 'GRAY' | 'WHITE';
  @Input()
  posts!: BlogPostCard[];
  @Input()
  category!: BlogCategory;

  mainPost!: BlogPostCard;
  restPosts!: BlogPostCard[];
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.posts && changes.posts.currentValue) {
      switch (this.type) {
        case 'SINGLE-SQUARE-DETAILED-COLLECTION':
          this.mainPost = this.posts[0];
          this.restPosts = this.posts.slice(1, 4);
          break;
      }
    }
  }
}
