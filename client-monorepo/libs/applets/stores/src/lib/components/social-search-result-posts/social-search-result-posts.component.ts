import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { SocialPostsGridComponent } from '@client-monorepo/social';

@Component({
  selector: 'stores-applet-social-search-result-posts',
  standalone: true,
  imports: [CommonModule, TitleSummaryComponent, SocialPostsGridComponent],
  templateUrl: './social-search-result-posts.component.html',
  styleUrl: './social-search-result-posts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialSearchResultPostsComponent {
  // Inputs
  searchText = input<string | undefined>(undefined);

  // Outputs
  onEmpty = output<void>();

  // Variables
  title = computed(() => 'پست‌های ' + this.searchText());

  handleEmptyPost(): void {
    this.onEmpty.emit();
  }
}
