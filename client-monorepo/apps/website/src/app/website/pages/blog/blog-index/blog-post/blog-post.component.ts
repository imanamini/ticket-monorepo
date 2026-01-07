import { Component, Input } from '@angular/core';
import { BlogPost } from '../../../../../api/clients/models/content/blog-post';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
  standalone: true,
  imports: [NgIf, RouterLink, UiButtonComponent],
})
export class BlogPostComponent {
  @Input()
  post!: BlogPost;

  @Input()
  showFull = false;

  isFileVideo(url: string) {
    const isVideo = ['.mpg', '.mp2', '.mpeg', '.mpe', '.mpv', '.mp4'];
    return isVideo.some((v) => url.includes(v));
  }
}
