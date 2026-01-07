import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { SocialPostsGridComponent } from '../social-posts-grid/social-posts-grid.component';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'common-social-popular-posts',
  standalone: true,
  imports: [CommonModule, TitleSummaryComponent, SocialPostsGridComponent, NgxSkeletonLoadingComponent],
  templateUrl: './social-popular-posts.component.html',
  styleUrl: './social-popular-posts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialPopularPostsComponent {
  displayState = signal<'show' | 'hidden' | 'pending'>('pending');
  displayStyle = computed(() => (this.displayState() === 'show' || this.displayState() === 'pending' ? 'flex' : 'none'));
  postIds = input<string[]>([]);
  title = input('');

  updateDisplayState(succession: boolean) {
    this.displayState.set(succession ? 'show' : 'hidden');
  }
}
