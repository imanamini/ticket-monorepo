import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { InstagramMediaTypes, SocialPost } from '@client-monorepo/social';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'common-social-post-preview',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent, NgxIcon],
  templateUrl: './social-post-preview.component.html',
  styleUrl: './social-post-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialPostPreviewComponent {
  // Inputs
  mode = input<'SQUARE' | 'RECTANGLE'>('SQUARE');
  postData = input<SocialPost | undefined>(undefined);

  // Models
  loading = model(false);

  // Variables
  protected readonly InstagramMediaTypes = InstagramMediaTypes;
  ratio = computed(() => (this.mode() === 'RECTANGLE' ? 1 / 1.2 : 1));
  imageError = signal(false);

  onImageLoad() {
    this.loading.set(false);
    this.imageError.set(false);
  }

  onImageError() {
    if (!this.imageError()) {
      this.loading.set(false);
      this.imageError.set(true);
    }
  }
}
