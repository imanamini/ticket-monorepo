import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ui-pagination',
  templateUrl: './ui-pagination.component.html',
  styleUrls: ['./ui-pagination.component.scss']
})

export class UiPaginationComponent implements OnInit {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 8;
  @Input() totalItems: number = 100;
  @Input() maxSize: number = 7;
  @Input() itemPerPage: number = 5;
  @Input() styles: Object = {};
  @Output() pageChange = new EventEmitter<number>();
  pages: any = [];

  constructor() {
  }

  ngOnInit(): void {
    this.pages = this.createPageArray(this.currentPage, this.maxSize);
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber <= this.totalItems && pageNumber !== this.currentPage) {
      this.pageChange.emit(pageNumber);
    }
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);

  }

  private createPageArray(currentPage: number, paginationRange: number): any[] {
    paginationRange = +paginationRange;
    let pages = [];

    const totalPages = this.totalPages;

    const halfWay = Math.ceil(paginationRange / 2);

    const isStart = currentPage <= halfWay;
    const isEnd = totalPages - halfWay < currentPage;
    const isMiddle = !isStart && !isEnd;

    let ellipsesNeeded = paginationRange < totalPages;
    let i = 1;

    while (i <= totalPages && i <= paginationRange) {
      let label;
      let pageNumber = this.calculatePageNumber(i, currentPage, paginationRange, totalPages);
      let openingEllipsesNeeded = (i === 2 && (isMiddle || isEnd));
      let closingEllipsesNeeded = (i === paginationRange - 1 && (isMiddle || isStart));
      if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
        label = '...';
      } else {
        label = pageNumber;
      }
      pages.push({
        label: label,
        value: pageNumber - 1
      });
      i++;
    }
    return pages;
  }

  private calculatePageNumber(i: number, currentPage: number, paginationRange: number, totalPages: number) {
    let halfWay = Math.ceil(paginationRange / 2);
    if (i === paginationRange) {
      return totalPages;
    } else if (i === 1) {
      return i;
    } else if (paginationRange < totalPages) {
      if (totalPages - halfWay < currentPage) {
        return totalPages - paginationRange + i;
      } else if (halfWay < currentPage) {
        return currentPage - halfWay + i;
      } else {
        return i;
      }
    } else {
      return i;
    }
  }

  getLastPage(): number {
    if (this.totalItems < 1) {
      return 1;
    }
    return Math.ceil(this.totalItems / this.itemPerPage);
  }
}
