import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { BranchesRestrictionFields, storeCategories, StoreCategory, StoreRestrictionFields } from '@client-monorepo/stores';
import { ActivatedRoute } from '@angular/router';
import { StoreFiltersService } from './store-filters.service';

@Injectable({
  providedIn: 'root',
})
export class MapHeaderService implements OnDestroy {
  private searchText = new BehaviorSubject<string>('');
  private selectedCategory = new BehaviorSubject<StoreCategory | undefined>(undefined);
  private queryParams: { [key: string]: string } = {};
  private subs = new Subscription();
  private activatedRoute = inject(ActivatedRoute);
  private filtersService = inject(StoreFiltersService);
  private categories = storeCategories;

  initService(): void {
    this.subscribeOnRouteParams();
  }

  private subscribeOnRouteParams(): void {
    this.subs.add(
      this.activatedRoute.queryParams.subscribe({
        next: (params) => {
          if (this.areParamsEqual(params, this.queryParams)) return;
          this.queryParams = params;
          if (this.queryParams[StoreRestrictionFields.CATEGORIES]) {
            this.selectedCategory.next(
              this.categories.filter((cat) => cat.title === this.queryParams[StoreRestrictionFields.CATEGORIES])[0],
            );
          } else {
            this.selectedCategory.next(undefined);
          }
          if (this.queryParams[BranchesRestrictionFields.KEYWORD]) {
            this.searchText.next(this.queryParams[StoreRestrictionFields.KEYWORD]);
          }
        },
      }),
    );
  }

  private areParamsEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  setSearchText(value: string): void {
    if (value.length > 1) {
      let query: { [key: string]: string } = this.queryParams;
      query = { ...query, [StoreRestrictionFields.KEYWORD]: value };
      this.filtersService.addFiltersToRoute(query);
    } else if (value.length === 0) {
      this.filtersService.bulkFilterRemover([StoreRestrictionFields.KEYWORD]);
    }
    this.searchText.next(value ?? '');
  }

  getSearchText(): Observable<string> {
    return this.searchText.asObservable();
  }

  setSelectedCategory(category: StoreCategory | undefined = undefined): void {
    this.selectedCategory.next(category);
    if (category) {
      let query: { [key: string]: string } = this.queryParams;
      query = { ...query, [StoreRestrictionFields.CATEGORIES]: String(category.title) };
      this.filtersService.addFiltersToRoute(query);
    } else {
      this.filtersService.bulkFilterRemover([StoreRestrictionFields.CATEGORIES]);
    }
  }

  getSelectedCategory(): Observable<StoreCategory | undefined> {
    return this.selectedCategory.asObservable();
  }

  reset(): void {
    this.selectedCategory.next(undefined);
    this.searchText.next('');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
