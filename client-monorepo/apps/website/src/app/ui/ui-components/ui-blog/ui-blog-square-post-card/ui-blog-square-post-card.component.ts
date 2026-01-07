import { Component, Input } from '@angular/core';
import { BlogCategory, BlogPostCard } from '../../../../api/clients/models/content/blog-post';
import { NgIf, NgClass, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-ui-blog-square-post-card',
  templateUrl: './ui-blog-square-post-card.component.html',
  styleUrls: ['./ui-blog-square-post-card.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, NgOptimizedImage],
})
export class UiBlogSquarePostCardComponent {
  @Input() post: BlogPostCard;

  goToBlogPost(post: BlogPostCard) {
    window.open('/mag/' + post.category.slug + '/' + post.slug + '/', '_blank');
  }

  goToCategory(category: BlogCategory) {
    window.open('/mag/' + category.slug + '/', '_self');
  }
}
