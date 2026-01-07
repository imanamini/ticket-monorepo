import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { SocialPostsGridComponent, SocialStorePost } from '@client-monorepo/social';

@Component({
  selector: 'common-social-store-preview',
  standalone: true,
  imports: [CommonModule, ApiImageModule, SocialPostsGridComponent],
  templateUrl: './social-store-preview.component.html',
  styleUrl: './social-store-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialStorePreviewComponent {
  // Inputs
  store = input<SocialStorePost | undefined>(undefined);
  isLoading = input(false);
}
