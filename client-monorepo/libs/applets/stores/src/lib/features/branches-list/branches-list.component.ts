import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoItemComponent, PageLayoutComponent, SearchComponent } from '@client-monorepo/common/ui-components';
import { LocationService } from '@client-monorepo/common/location-management';
import { BranchModel, StoresApiService, StoreSearchBranchesConfig } from '@client-monorepo/stores';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchOverviewComponent } from '../../components/store-branch-overview/branch-overview.component';
import { normalizeSearchText, rangeCreator, ScrolledToEndDirective } from '@client-monorepo/common/utilities';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { BackHandlerService } from '@client-monorepo/back-handler';

@Component({
  selector: 'stores-applet-branches-list',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    BranchOverviewComponent,
    SearchComponent,
    ScrolledToEndDirective,
    NoItemComponent,
    NgxSkeletonLoadingComponent,
  ],
  templateUrl: './branches-list.component.html',
  styleUrl: './branches-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchesListComponent implements OnInit, OnDestroy, AfterViewChecked {
  protected readonly rangeCreator = rangeCreator;
  searchComponent = viewChild<SearchComponent>('searchComponent');
  activatedRoute = inject(ActivatedRoute);
  bottomNavigationService = inject(NgxBottomNavigationService);
  destroyRef = inject(DestroyRef);
  locationService = inject(LocationService);
  storeApi = inject(StoresApiService);
  router = inject(Router);
  backHandler = inject(BackHandlerService);
  branches = signal<BranchModel[]>([]);
  trackingCode = signal<string | undefined>(undefined);
  size = 10;
  branchesLoading = signal<boolean>(false);
  searchText = signal<string | undefined>(undefined);
  page = 0;
  haveNextPage = true;
  initialized = signal<boolean>(false);

  ngOnInit(): void {
    this.getTrackingCode();
    this.getLocation();
    this.searchBranches();
    this.bottomNavigationService.hide();
  }

  ngAfterViewChecked() {
    if (this.searchComponent()?.searchEl() && !this.initialized()) {
      this.searchComponent()?.searchEl()?.nativeElement.focus();
      this.initialized.set(true);
    }
  }

  getLocation(): void {
    this.locationService.getGuaranteedLocation().subscribe();
  }

  getTrackingCode(): void {
    this.trackingCode.set(decodeURI(this.activatedRoute.snapshot.paramMap.get('trackingCode') as string));
  }

  private searchBranches(reset = false): void {
    if (!this.trackingCode() || this.branchesLoading()) return;
    if (reset) this.branches.set([]);
    this.branchesLoading.set(true);
    const config: StoreSearchBranchesConfig = {
      page: this.page,
      size: this.size,
      storeTrackingCode: this.trackingCode(),
      searchText: this.searchText(),
      mode: 'branch-only',
    };
    this.storeApi.searchBranches(config).subscribe({
      next: (res) => {
        if (res) {
          this.branches.update((branches) => [...branches, ...res.branches]);
        } else {
          this.branches.set([]);
        }
        this.haveNextPage = res.totalElements > this.branches().length;
      },
      complete: () => {
        this.branchesLoading.set(false);
        this.initialized.set(true);
      },
    });
  }

  listEnded(): void {
    if (this.haveNextPage && this.initialized() && this.branches().length > 0) {
      this.page++;
      this.searchBranches();
    }
  }

  doSearch(query: string | undefined): void {
    this.searchText.set(normalizeSearchText(query));
    if (this.initialized()) {
      this.searchBranches(true);
    }
  }

  closePage(): void {
    this.backHandler.goBack();
  }

  ngOnDestroy(): void {
    this.bottomNavigationService.show();
  }
}
