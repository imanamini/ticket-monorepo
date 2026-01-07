import { Component, Input } from '@angular/core';
import { BlogCategory, BlogPostCard } from '../../../../../api/clients/models/content/blog-post';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiPostCardComponent } from '../../../../../ui/ui-components/ui-post-card/ui-post-card/ui-post-card.component';
import { NgFor, NgIf } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-category-rest-posts',
  templateUrl: './category-rest-posts.component.html',
  styleUrls: ['./category-rest-posts.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, UiPostCardComponent, UiButtonComponent, NgxIcon],
})
export class CategoryRestPostsComponent {
  @Input() posts: BlogPostCard[];
  @Input() category: BlogCategory;
}
