import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { FramedIconComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { SearchHistoryService } from '../../../../../stores/src/lib/data-access/services/search-history.service';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { FrequentServiceInterface } from '@client-monorepo/common/service-data';
import { NgClass } from '@angular/common';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxRouterLoadingDirective } from '@digipay/ngx-router-loading';

@Component({
  selector: 'hub-applet-hub-search-history',
  standalone: true,
  imports: [TitleSummaryComponent, FramedIconComponent, NgClass, NgxSkeletonLoadingComponent, NgxRouterLoadingDirective],
  templateUrl: './hub-search-history.component.html',
  styleUrl: './hub-search-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubSearchHistoryComponent {
  rangeCreator = rangeCreator;
  searchHistoryService = inject(SearchHistoryService);
  services = input<Array<FrequentServiceInterface>>([]);
  historyLoading = computed<boolean>(() => {
    return this.searchHistoryService.hubSearchLoading();
  });
  searchHistory = computed<Array<FrequentServiceInterface>>(() => {
    return this.searchHistoryService
      .hubSearchHistory()
      .map((id) => this.services().find((s) => s.id === id))
      .filter((s): s is FrequentServiceInterface => !!s);
  });
  itemClicked = output<FrequentServiceInterface>();
  hasHistory = output<boolean>();
  constructor() {
    effect(() => {
      if (!this.historyLoading()) {
        this.hasHistory.emit(!!this.searchHistory().length);
      }
    });
  }
  itemClickedHandle(service: FrequentServiceInterface): void {
    this.itemClicked.emit(service);
  }
  removeHistory(): void {
    this.searchHistoryService.clearHubSearchHistory();
  }

  protected readonly ServiceImagesType = ServiceImagesType;
}
