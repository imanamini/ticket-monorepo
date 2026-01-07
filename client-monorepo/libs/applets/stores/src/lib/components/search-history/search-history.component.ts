import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalScrollComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { SearchHistoryService } from '../../data-access/services/search-history.service';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'stores-applet-search-history',
  standalone: true,
  imports: [CommonModule, HorizontalScrollComponent, NgxChipComponent, TitleSummaryComponent, NgxBadgeModule, NgxIcon],
  templateUrl: './search-history.component.html',
  styleUrl: './search-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchHistoryComponent {
  rangeCreator = rangeCreator;
  searchHistoryService = inject(SearchHistoryService);
  historyLoading = computed<boolean>(() => {
    return this.searchHistoryService.historyLoading();
  });
  searchHistory = computed<Array<string>>(() => {
    return this.searchHistoryService.searchHistory();
  });
  itemClicked = output<string>();
  hasHistory = output<boolean>();

  constructor() {
    effect(() => {
      if (!this.historyLoading()) {
        this.hasHistory.emit(!!this.searchHistory().length);
      }
    });
  }

  itemClickedHandle(itemText: string): void {
    this.itemClicked.emit(itemText);
  }

  removeItem(event: any, itemText: string): void {
    event.stopPropagation();
    this.searchHistoryService.removeSingleHistory(itemText);
  }

  removeAllHistory(): void {
    this.searchHistoryService.clearHistory();
  }
}
