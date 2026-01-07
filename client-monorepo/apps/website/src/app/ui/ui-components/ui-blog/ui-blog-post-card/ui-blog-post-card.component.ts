import { Component, Input } from '@angular/core';
import { BlogPost } from '../../../../api/clients/models/content/blog-post';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ui-blog-post-card',
  templateUrl: './ui-blog-post-card.component.html',
  styleUrls: ['./ui-blog-post-card.component.scss'],
  standalone: true,
  imports: [RouterLink, NgIf],
})
export class UiBlogPostCardComponent {
  @Input()
  blogPost!: BlogPost;
}
