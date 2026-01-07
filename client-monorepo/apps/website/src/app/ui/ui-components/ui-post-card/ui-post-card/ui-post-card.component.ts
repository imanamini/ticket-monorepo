import { Component, Input, OnInit } from '@angular/core';
import { BlogCategory, BlogPostCard } from '../../../../api/clients/models/content/blog-post';
import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-post-card',
  templateUrl: './ui-post-card.component.html',
  styleUrls: ['./ui-post-card.component.scss'],
  standalone: true,
  imports: [NgIf, NgOptimizedImage, NgClass, NgxIcon],
})
export class UiPostCardComponent implements OnInit {
  @Input() post: BlogPostCard;
  description: string;
  title: string;

  ngOnInit(): void {
    if (this.post.description) {
      if (this.post.description.length > 164) {
        this.description = this.post.description.slice(0, 160) + ' ...';
      } else {
        this.description = this.post.description;
      }
    }

    if (this.post.title) {
      if (this.post.title.length > 94) {
        this.title = this.post.title.slice(0, 90) + ' ...';
      } else {
        this.title = this.post.title;
      }
    }
  }

  goToBlogPost(post: BlogPostCard) {
    window.open('/mag/' + post.category.slug + '/' + post.slug + '/', '_blank');
  }

  goToCategory(category: BlogCategory) {
    window.open('/mag/' + category.slug + '/', '_self');
  }
}
