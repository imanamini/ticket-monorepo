import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxSearchBoxComponent } from '@digipay/ngx-search-box';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { Subscription } from 'rxjs';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { StorePreviewComponent } from '@client-monorepo/stores';
import { SocialSearchResultPostsComponent } from '../../components/social-search-result-posts/social-search-result-posts.component';
import { SocialSearchResultStoresComponent } from '../../components/social-search-result-stores/social-search-result-stores.component';
import { SocialApiService, SocialPostsGridComponent } from '@client-monorepo/social';
import { NoItemComponent } from '@client-monorepo/common/ui-components';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'stores-applet-social-explore',
  standalone: true,
  imports: [
    CommonModule,
    NgxAppBarComponent,
    SocialPostsGridComponent,
    DpIconComponent,
    StorePreviewComponent,
    SocialSearchResultPostsComponent,
    SocialSearchResultStoresComponent,
    NoItemComponent,
    FormsModule,
    NgxSearchBoxComponent,
  ],
  templateUrl: './social-explore.component.html',
  styleUrl: './social-explore.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialExploreComponent implements OnInit, OnDestroy {
  // Injections
  socialApiService = inject(SocialApiService);
  backHandler = inject(BackHandlerService);
  bottomNavService = inject(NgxBottomNavigationService);

  // Variables
  protected readonly rangeCreator = rangeCreator;
  sectionToShow = signal<'MAIN' | 'SUGGESTIONS' | 'SEARCH_RESULT'>('MAIN');
  showMerchantsResult = signal(true);
  showPostsResult = signal(true);
  searchText = signal<string>('');
  searchTextForOthers = signal<string>('');
  searching = signal(false);
  suggestions = signal(['موبایل', 'لپتاپ', 'دسکتاپ', 'هدفون', 'ساعت']);
  appBarTitle = computed(() =>
    this.sectionToShow() === 'SUGGESTIONS' || this.sectionToShow() === 'SEARCH_RESULT' ? 'جستجو' : 'محصولات اینستاگرام',
  );
  ctaSearchText = computed(() => {
    return `جستجوی "${this.searchText()}"`;
  });
  searchSubscription = new Subscription();

  constructor() {
    effect(
      () => {
        if (this.searchText().length <= 1) {
          this.searchTextForOthers.set('');
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.bottomNavService.hide();
  }

  doSearch(searchText: string) {
    if (this.searching()) return;
    this.searchText.set(searchText);
    const phrase = this.searchText();
    if (phrase.length <= 1) {
      if (this.sectionToShow() !== 'MAIN') this.sectionToShow.set('MAIN');
      return;
    } else if (phrase.length > 1) {
      this.sectionToShow.set('SUGGESTIONS');
    }
    this.searching.set(true);
    this.searchSubscription.add(
      this.socialApiService.getSuggestions(phrase).subscribe({
        next: (res) => {
          this.suggestions.set(res.topQuerySuggestions);
        },
        complete: () => {
          this.searching.set(false);
        },
      }),
    );
  }

  handleEnterKey(): void {
    if (this.searchText() !== '' && this.searchText().length > 1) {
      this.suggestionClick(this.searchText());
    }
  }

  handleSearchState(phrase: string) {
    if (phrase !== '' && phrase.length > 1) {
      this.showMerchantsResult.set(true);
      this.showPostsResult.set(true);
      this.sectionToShow.set('SEARCH_RESULT');
    } else {
      this.sectionToShow.set('MAIN');
      this.unsubSearch();
    }
  }

  suggestionClick(suggestion: string): void {
    this.searchText.set(suggestion);
    this.handleSearchState(suggestion);
    this.searchTextForOthers.set(suggestion);
  }

  handleEmptyMerchants(): void {
    this.showMerchantsResult.set(false);
  }

  handleEmptyPosts(): void {
    this.showPostsResult.set(false);
  }

  goBack(): void {
    this.backHandler.goBack();
  }

  unsubSearch(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.bottomNavService.show();
  }
}
