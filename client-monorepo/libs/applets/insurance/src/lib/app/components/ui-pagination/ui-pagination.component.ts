import {
  Component,
  EventEmitter,
  Input,
  numberAttribute,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { PaginatorModel } from './models/paginator.model';

@Component({
  selector: 'ui-pagination',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './ui-pagination.component.html',
  styleUrl: './ui-pagination.component.scss'
})
export class UiPaginationComponent implements OnInit, OnChanges {

  @Input({transform: numberAttribute}) totalRecords = 0;
  @Input({transform: numberAttribute}) rows = 0;
  @Input({transform: numberAttribute}) pageLinkSize = 5;
  @Output() onPageChange: EventEmitter<PaginatorModel> = new EventEmitter<PaginatorModel>();
  mFirst = 0;
  mPage = 0;
  pageLinks: number[] | undefined;
  paginatorState: any;

  constructor() {
  }

  @Input() get first(): number {
    return this.mFirst;
  }

  set first(val: number) {
    this.mFirst = val;
  }

  ngOnInit(): void {
    this.updatePaginatorState();
  }

  ngOnChanges(simpleChange: SimpleChanges): void {
    if (simpleChange.totalRecords) {
      this.updatePageLinks();
      this.updatePaginatorState();
      this.updateFirst();
    }

    if (simpleChange.first) {
      this.mFirst = simpleChange.first.currentValue;
      this.updatePageLinks();
      this.updatePaginatorState();
    }

    if (simpleChange.rows) {
      this.updatePageLinks();
      this.updatePaginatorState();
    }

    if (simpleChange.pageLinkSize) {
      this.updatePageLinks();
    }
  }

  isFirstPage(): boolean {
    return this.getPage() === 0;
  }

  isLastPage(): boolean {
    return this.getPage() === this.getPageCount() - 1;
  }

  getPageCount(): number {
    return Math.ceil(this.totalRecords / this.rows);
  }

  calculatePageLinkBoundaries(): [number, number] {
    const numberOfPages = this.getPageCount();
    const visiblePages = Math.min(this.pageLinkSize, numberOfPages);

    // calculate range, keep current in middle if necessary
    let start = Math.max(0, Math.ceil(this.getPage() - visiblePages / 2));
    const end = Math.min(numberOfPages - 1, start + visiblePages - 1);

    // check when approaching to last page
    const delta = this.pageLinkSize - (end - start + 1);
    start = Math.max(0, start - delta);

    return [start, end];
  }

  changePage(p: number): void {
    const pc = this.getPageCount();
    if (p >= 0 && p < pc) {
      this.mFirst = this.rows * p;
      const state = {
        page: p,
        first: this.first,
        rows: this.rows,
        pageCount: pc
      };
      this.updatePageLinks();

      this.onPageChange.emit(state);
      this.updatePaginatorState();
    }
  }

  updatePaginatorState(): void {
    this.paginatorState = {
      page: this.getPage(),
      pageCount: this.getPageCount(),
      rows: this.rows,
      first: this.first,
      totalRecords: this.totalRecords
    };
  }

  updatePageLinks(): void {
    this.pageLinks = [];
    const boundaries = this.calculatePageLinkBoundaries();
    const start = boundaries[0];
    const end = boundaries[1];
    for (let i = start; i <= end; i++) {
      this.pageLinks.push(i + 1);
    }
  }

  updateFirst(): void {
    const page = this.getPage();
    if (page > 0 && this.totalRecords && this.first >= this.totalRecords) {
      Promise.resolve(null).then(() => this.changePage(page - 1));
    }
  }

  onPageLinkClick(event: Event, page: number): void {
    this.changePage(page);
    event.preventDefault();
  }

  getPage(): number {
    return Math.floor(this.first / this.rows);
  }

  changePageToPrev(event: Event): void {
    this.changePage(this.getPage() - 1);
    event.preventDefault();
  }

  changePageToNext(event: Event): void {
    this.changePage(this.getPage() + 1);
    event.preventDefault();
  }

  currentPage(): number {
    return this.getPageCount() > 0 ? this.getPage() + 1 : 0;
  }
}

