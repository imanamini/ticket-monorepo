import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoItemComponent, PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { SearchResultComponent } from '../../components/search-result/search-result.component';
import {
  AppService,
  AppServiceCategoryNamesEnum,
  appServicesCategoriesConst,
  AppServiceStatusEnum,
  FrequentServiceInterface,
} from '@client-monorepo/common/service-data';
import { Router } from '@angular/router';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { SearchHistoryService } from '../../../../../stores/src/lib/data-access/services/search-history.service';
import { HubSearchHistoryComponent } from '../../components/hub-search-history/hub-search-history.component';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { NgxSearchBoxComponent } from '@digipay/ngx-search-box';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventManagementService } from '@client-monorepo/common/event-management';

@Component({
  selector: 'hub-applet-hub-search',
  standalone: true,
  imports: [CommonModule, SearchResultComponent, NoItemComponent, PageLayoutComponent, HubSearchHistoryComponent, NgxSearchBoxComponent],
  templateUrl: './hub-search.component.html',
  styleUrl: './hub-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubSearchComponent implements OnInit, OnDestroy {
  appServiceService = inject(AppService);
  router = inject(Router);
  bottomNavigationService = inject(NgxBottomNavigationService);
  private searchHistoryService = inject(SearchHistoryService);
  actionHandlerService = inject(ActionHandlerService);
  destroyRef = inject(DestroyRef);
  private eventManagementService = inject(EventManagementService);
  services = signal<Array<FrequentServiceInterface>>([]);
  showingServices = signal<Array<FrequentServiceInterface>>([]);
  appServicesCategoriesConst = appServicesCategoriesConst;
  AppServiceCategoryNamesEnum = AppServiceCategoryNamesEnum;
  searchText = signal<string>('');
  searching = signal<boolean>(false);
  searched = signal<boolean>(false);
  rangeCreator = rangeCreator;
  hasHistory = signal(false);
  isLoading = signal(true);
  ngOnInit() {
    this.searchHistoryService.refreshHubSearchHistory();
    this.getServices();
    this.bottomNavigationService.hide();
  }

  ngOnDestroy() {
    this.bottomNavigationService.show();
  }

  getServices(): void {
    this.appServiceService
      .getMappedServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (services) => {
          this.services.set(services);
          this.isLoading.set(false);
        },
      });
  }

  normalizeText(text: string): string {
    if (!text) return '';
    return text.replace(/\u200c/g, ' ').toLowerCase();
  }

  doSearch(searchText = ''): void {
    this.searching.set(true);
    const normalizedSearchText = this.normalizeText(searchText);
    if (normalizedSearchText && normalizedSearchText.length >= 2 && this.services().length) {
      this.showingServices.set(
        this.services().filter((service) => {
          const normalizedTitle = this.normalizeText(service.title as string);
          const normalizedTags = service.tags?.map((tag) => this.normalizeText(tag));

          return normalizedTitle.includes(normalizedSearchText) || normalizedTags?.some((tag) => tag.includes(normalizedSearchText));
        }),
      );
      this.searching.set(false);
      this.searched.set(true);
    } else {
      this.showingServices.set([]);
      this.searching.set(false);
      this.searched.set(false);
    }
  }

  handleResultClick(service: FrequentServiceInterface) {
    const status = service.status;
    const isClickable = status !== this.AppServiceStatus.DISABLED && status !== this.AppServiceStatus.NO_ACTION;
    if (!isClickable) return;
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: ['hub', 'search'],
      data: {
        target: `service: ${service.title}`,
      },
    });
    this.searchHistoryService.pushToHubSearchHistory(service.id);
    this.actionHandlerService
      .handle({
        type: ActionType.GO_TO_SERVICE,
        payload: {
          serviceId: service.id,
        },
      })
      .then();
  }

  handleHasHistory(hasHistory: boolean): void {
    this.hasHistory.set(hasHistory);
  }

  protected readonly AppServiceStatus = AppServiceStatusEnum;
}
