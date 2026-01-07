import { Component, Input } from '@angular/core';
import { BlogCategory, BlogPostCard } from '../../../../api/clients/models/content/blog-post';
import { PostCardShortenerPipe } from '../../../ui-pipes/post-card-shortener.pipe';
import { NgIf, NgClass, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-ui-blog-mobile-post-card',
  templateUrl: './ui-blog-mobile-post-card.component.html',
  styleUrls: ['./ui-blog-mobile-post-card.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, NgOptimizedImage, PostCardShortenerPipe],
})
export class UiBlogMobilePostCardComponent {
  @Input() post: BlogPostCard;
  @Input() type: 'TEXT' | 'VIDEO' | 'AUDIO' = 'TEXT';

  goToCategory(category: BlogCategory) {
    window.open('/mag/' + category.slug + '/', '_self');
  }

  goToBlogPost(post: BlogPostCard) {
    window.open('/mag/' + post.category.slug + '/' + post.slug + '/', '_blank');
  }
}
