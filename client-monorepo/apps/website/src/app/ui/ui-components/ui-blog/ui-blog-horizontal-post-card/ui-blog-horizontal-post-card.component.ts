import { Component, Input } from '@angular/core';
import { BlogCategory, BlogPostCard } from '../../../../api/clients/models/content/blog-post';
import { PostCardShortenerPipe } from '../../../ui-pipes/post-card-shortener.pipe';
import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-ui-blog-horizontal-post-card',
  templateUrl: './ui-blog-horizontal-post-card.component.html',
  styleUrls: ['./ui-blog-horizontal-post-card.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgOptimizedImage, PostCardShortenerPipe],
})
export class UiBlogHorizontalPostCardComponent {
  @Input() post: BlogPostCard;
  @Input() showDescription = true;
  @Input() showCta = true;
  @Input() type: 'TEXT' | 'VIDEO' | 'AUDIO' = 'TEXT';

  goToCategory(category: BlogCategory) {
    window.open('/mag/' + category.slug + '/', '_self');
  }

  handleHeight(numeric = false) {
    if (!numeric) {
      if (this.showDescription && this.showCta) {
        return 'large';
      } else if (this.showDescription && !this.showCta) {
        return 'medium';
      } else if (!this.showDescription && this.showCta) {
        return 'small';
      } else if (!this.showDescription && !this.showCta) {
        return 'extra-small';
      }
    } else {
      if (this.showDescription && this.showCta) {
        return 264;
      } else if (this.showDescription && !this.showCta) {
        return 230;
      } else if (!this.showDescription && this.showCta) {
        return 194;
      } else if (!this.showDescription && !this.showCta) {
        return 158;
      }
    }
  }

  goToBlogPost(post: BlogPostCard) {
    window.open('/mag/' + post.category.slug + '/' + post.slug + '/', '_blank');
  }
}
