import { Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-blog-archive-pagination',
  templateUrl: './blog-archive-pagination.component.html',
  styleUrls: ['./blog-archive-pagination.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, UiIconDirective, NgFor, RouterLink, NgxIcon],
})
export class BlogArchivePaginationComponent implements OnInit, OnChanges {
  @Input()
  totalPages: number;

  @Input()
  maxAccessiblePageIndex = 5;

  @Input()
  currentIndex: number;

  indexState: 'START' | 'MIDDLE' | 'END' = 'START';

  indicesRange: Array<number>;

  queryParams = '';

  baseUrl = '';

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.baseUrl = '';
    } else {
      this.baseUrl = 'https://www.mydigipay.com';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.totalPages || changes.currentIndex) {
      this.updateIndexesStatus();
    }
  }

  ngOnInit(): void {
    this.indicesRange = new Array(this.totalPages).fill(0).map((value, index) => index + 1);
    this.updateIndexesStatus();
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length === 0) {
        return;
      }
      this.queryParams = params.categoryId.length > 0 ? params.categoryId : null;
    });
  }

  updateIndexesStatus() {
    if (this.totalPages > this.maxAccessiblePageIndex) {
      if (this.currentIndex <= 2) {
        this.indexState = 'START';
        this.indicesRange = this.createIndexesRange(1, 3, this.totalPages);
      } else if (this.currentIndex < this.totalPages - 2) {
        this.indexState = 'MIDDLE';
        this.indicesRange = this.createIndexesRange(this.currentIndex - 2, this.currentIndex + 1, this.totalPages);
      } else {
        this.indexState = 'END';
        this.indicesRange = this.createIndexesRange(this.totalPages - 4, this.totalPages - 1, this.totalPages);
      }
    } else {
      this.indicesRange = this.createIndexesRange(1, this.totalPages - 1, this.totalPages);
    }
  }

  createIndexesRange(startIndex: number, endIndex: number, maxSize: number) {
    const maxRangeIndexes = new Array(maxSize).fill(0).map((value, index) => index + 1);
    return maxRangeIndexes.slice(startIndex, endIndex);
  }
}
