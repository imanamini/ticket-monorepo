import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, OnInit, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxSearchBoxComponent } from '@digipay/ngx-search-box';
import { MapHeaderService } from '../../data-access/services/map-header.service';
import { Subscription } from 'rxjs';
import { BranchModel, StoreCategory, StoresApiService, StoreSearchBranchesConfig, StoresService } from '@client-monorepo/stores';
import { ItemOverview, ItemOverviewComponent, SearchComponent } from '@client-monorepo/common/ui-components';
import { DistancePipe } from '@digipay/ng-lib-pipes';
import { MapEmptyResultComponent } from '../map-empty-result/map-empty-result.component';

@Component({
  selector: 'stores-applet-map-search-result',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, NgxSearchBoxComponent, ItemOverviewComponent, MapEmptyResultComponent],
  providers: [DistancePipe],
  templateUrl: './map-search-result.component.html',
  styleUrl: './map-search-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapSearchResultComponent implements OnInit, OnDestroy {
  // Injections
  mapHeaderService = inject(MapHeaderService);
  storesApiService = inject(StoresApiService);
  storesService = inject(StoresService);
  distancePipe = inject(DistancePipe);

  // Outputs
  branchSelected = output<BranchModel>();

  // Variables
  searchComponent = viewChild<SearchComponent>('searchComponent');
  subs = new Subscription();
  searchText = signal<string>('');
  initialized = signal(false);
  selectedCategory = signal<StoreCategory | undefined>(undefined);
  loadingBranches = signal<boolean>(true);
  branches = signal<BranchModel[]>([]);
  branchesToShow = computed<{ item: ItemOverview; branch: BranchModel }[]>(() =>
    this.storesService.convertBranchToItemOverView(this.branches(), this.distancePipe, true),
  );
  totalAvailableItems = signal<number>(0);

  constructor() {
    effect(() => {
      if (this.searchComponent()?.searchEl() && !this.initialized()) {
        setTimeout(() => {
          this.initialized.set(true);
          this.searchComponent()?.searchEl()?.nativeElement.focus();
        });
      }
    });
  }

  ngOnInit() {
    this.subOnSearchText();
    this.subOnCategory();
  }

  subOnSearchText(): void {
    this.subs.add(
      this.mapHeaderService.getSearchText().subscribe((text) => {
        this.searchText.set(text);
        if (text.length > 1) {
          this.searchBranches();
        }
      }),
    );
  }

  subOnCategory(): void {
    this.subs.add(
      this.mapHeaderService.getSelectedCategory().subscribe((category) => {
        this.selectedCategory.set(category);
      }),
    );
  }

  searchBranches(): void {
    this.loadingBranches.set(true);
    const config: StoreSearchBranchesConfig = {
      size: 100,
      storeCategories: this.selectedCategory() ? [this.selectedCategory()!.title] : undefined,
      searchText: this.searchText(),
    };
    this.storesApiService.searchBranches(config).subscribe((res) => {
      this.branches.set(res.branches);
      this.totalAvailableItems.set(res.totalElements);
      this.loadingBranches.set(false);
    });
  }

  handleSearchTextChange(text: string): void {
    this.mapHeaderService.setSearchText(text);
  }

  handleBranchClick(branch: BranchModel): void {
    this.branchSelected.emit(branch);
  }

  goBack(): void {
    this.mapHeaderService.setSearchText('');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
