import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSearchBoxComponent } from '@digipay/ngx-search-box';
import { StoreCategoriesFilterComponent } from '@client-monorepo/store-categories-filter';
import { StoreCategory } from '@client-monorepo/stores';
import { MapHeaderService } from '../../data-access/services/map-header.service';
import { Subscription } from 'rxjs';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { BackHandlerService } from '@client-monorepo/back-handler';

@Component({
  selector: 'stores-applet-map-header-mobile',
  standalone: true,
  imports: [CommonModule, NgxSearchBoxComponent, StoreCategoriesFilterComponent, NgxButtonComponent],
  templateUrl: './map-header-mobile.component.html',
  styleUrl: './map-header-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapHeaderMobileComponent implements OnInit, OnDestroy {
  // Injections
  mapHeaderService = inject(MapHeaderService);
  backHandler = inject(BackHandlerService);

  // Inputs
  searchbarMode = input<'section' | 'page'>('page');
  searchBarClasses = input<string>('');
  filterClasses = input<string>('');
  showBackButton = input<boolean>(false);

  // Variables
  subs = new Subscription();
  searchText = signal<string>('');
  selectedCategory = signal<StoreCategory | undefined>(undefined);

  ngOnInit() {
    this.subOnCategory();
    this.subOnSearchText();
  }

  subOnCategory(): void {
    this.subs.add(
      this.mapHeaderService.getSelectedCategory().subscribe({
        next: (cat) => {
          this.selectedCategory.set(cat);
        },
      }),
    );
  }

  subOnSearchText(): void {
    this.subs.add(
      this.mapHeaderService.getSearchText().subscribe({
        next: (text) => {
          this.searchText.set(text);
        },
      }),
    );
  }

  changeCategory(category: StoreCategory | undefined = undefined): void {
    this.mapHeaderService.setSelectedCategory(category);
  }

  handleSearchTextChange(text: string): void {
    this.mapHeaderService.setSearchText(text);
  }

  handleBackClick(): void {
    this.backHandler.goBack();
  }

  ngOnDestroy() {
    this.mapHeaderService.reset();
    this.subs.unsubscribe();
  }
}
