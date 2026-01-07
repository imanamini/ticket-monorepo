import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { UiDialogFilterComponent } from './ui-dialog-filter/ui-dialog-filter.component';
import { BlogClient } from '../../../../api/clients/blog-client';
import { BlogArchiveResponse } from '../../../../api/digipay/models/blog/blog-archive.response';
import { ArchiveFilters } from '../../../../api/digipay/models/blog/archive-filters.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { BlogArchivePaginationComponent } from './blog-archive-pagination/blog-archive-pagination.component';
import { UiPostCardComponent } from '../../../../ui/ui-components/ui-post-card/ui-post-card/ui-post-card.component';
import { UiSpinnerComponent } from '../../../../ui/ui-components/ui-loading/ui-spinner/ui-spinner.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { NgIf, NgFor } from '@angular/common';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { UiIconDirective } from '../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-blog-archive',
  templateUrl: './blog-archive.component.html',
  styleUrls: ['./blog-archive.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    CategoryFilterComponent,
    UiIconDirective,
    UiSpinnerComponent,
    NgFor,
    UiPostCardComponent,
    BlogArchivePaginationComponent,
  ],
})
export class BlogArchiveComponent implements OnInit, OnDestroy {
  blogArchiveData: BlogArchiveResponse;

  archiveFilters: ArchiveFilters;

  selectedCategoryId: BehaviorSubject<string> = new BehaviorSubject('');

  subscriptions: Subscription[] = [];

  totalPages: number;

  perPage = 10;

  currentPage = 1;

  isLoading = true;

  constructor(
    private blogClient: BlogClient,
    private bottomSheet: MatBottomSheet,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private seo: SeoService,
    private router: Router,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {}

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['page-idx-slug'] && Number.isNaN(+this.activatedRoute.snapshot.params['page-idx-slug'])) {
      this.redirectToSelfAndShowNotFound();
    }

    this.subscriptions[0] = this.activatedRoute.params.subscribe((params) => {
      this.currentPage = +params['page-idx-slug'] ? +params['page-idx-slug'] : 1;
      this.activatedRoute.queryParams.subscribe((queryParams) => {
        const url = this.activatedRoute.snapshot['_routerState'].url;
        this.seo.setCanonical('https://www.mydigipay.com' + url.replace('.', ''));
        if (queryParams.categoryId) {
          this.selectedCategoryId.next(queryParams.categoryId);
          this.getPosts(queryParams.categoryId, this.perPage, this.currentPage);
        } else {
          this.selectedCategoryId.next('');
          this.getPosts('', this.perPage, this.currentPage);
        }
      });
    });

    this.subscriptions[1] = this.selectedCategoryId.subscribe((categoryId) => {
      this.scrollToTop();
    });

    this.subscriptions[2] = this.blogClient.getArchiveFilters().subscribe((response) => {
      this.archiveFilters = response.filters;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  isCategoryAlreadyLoaded(categoryId: string) {
    return this.selectedCategoryId.getValue() === categoryId;
  }

  getPosts(categoryId: string, perPage: number, pageIndex: number) {
    this.isLoading = true;
    this.blogClient.getArchiveData(categoryId, perPage, pageIndex).subscribe(
      (response) => {
        this.totalPages = response.totalPages;
        this.blogArchiveData = response;
        this.changeDetectorRef.detectChanges();
        this.updatePageTitle();
        this.isLoading = false;
      },
      (error) => {
        this.redirectToSelfAndShowNotFound();
      },
    );
  }

  openFiltersDialog() {
    this.bottomSheet
      .open(UiDialogFilterComponent, {
        data: {
          filters: this.archiveFilters,
          selectedCategoryId: this.selectedCategoryId.getValue(),
        },
      })
      .afterDismissed()
      .subscribe((value) => {
        if (value === undefined) {
          return;
        }

        if (value !== this.selectedCategoryId.getValue()) {
          this.categoryClicked(value);
        }
      });
  }

  categoryClicked(categoryId: string) {
    if (this.isCategoryAlreadyLoaded(categoryId)) {
      return;
    }
    this.router.navigate(['/mag/archive/.'], {
      queryParams: {
        categoryId: categoryId ? categoryId : null,
      },
    });
  }

  updatePageTitle() {
    let txtTitle = 'آرشیو مقالات صفحه ' + this.currentPage + ' از ' + this.totalPages;

    if (this.currentPage === 1) {
      txtTitle = 'آرشیو مقالات';
    }

    this.seo.setPageTitle(txtTitle);
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  getTargetPageUrl(categoryId: string) {
    let pageUrl = 'mag/archive/';

    categoryId && (pageUrl += `?categoryId=${categoryId}`);

    return pageUrl;
  }

  /*
   * This method is used to show not found page
   * but keeps the user's entered url and if the user reload's
   * he/she see's the not found page again.
   *
   * In this method we redirect to not found page somehow
   *
   * @ TODO: Revise our way to show not found page
   */
  redirectToSelfAndShowNotFound() {
    let path = this.router.url;
    if (path.slice(-1) === '.') {
      path = path.substring(0, path.length - 1);
    }
    this.router.navigate([path], { skipLocationChange: true });
  }
}
