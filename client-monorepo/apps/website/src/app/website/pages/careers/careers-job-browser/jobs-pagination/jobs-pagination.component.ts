import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-jobs-pagination',
  templateUrl: './jobs-pagination.component.html',
  styleUrls: ['./jobs-pagination.component.scss'],
  standalone: true,
  imports: [NgClass, NgFor],
})
export class JobsPaginationComponent implements OnChanges {
  @Output()
  pageChanged = new EventEmitter();

  @Input()
  currentPage: number;

  @Input()
  totalPages: number;

  pages: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.totalPages) {
      this.buildPageNumbers();
    }
  }

  onPageClick(pageNumber: string): void {
    if (pageNumber !== '...') {
      this.currentPage = +pageNumber;
      this.buildPageNumbers();
    }
  }

  onNextClick() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.buildPageNumbers();
    }
  }

  onPrevClick() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.buildPageNumbers();
    }
  }

  private buildPageNumbers() {
    let max = 1;
    const pages = ['1'];

    if (this.totalPages <= 1) {
      this.pages = pages;
      return;
    }

    if (this.totalPages >= 2) {
      max = 2;
      pages.push('2');
    }

    if (this.currentPage - max > 2) {
      pages.push('...');
    }

    for (let x = this.currentPage - 2; x < this.currentPage; x++) {
      if (x > 1 && pages.indexOf('' + x) < 0) {
        pages.push('' + x);
        if (x > max) {
          max = x;
        }
      }
    }

    for (let x = this.currentPage; x <= this.currentPage + 2; x++) {
      if (x < this.totalPages && pages.indexOf('' + x) < 0) {
        pages.push('' + x);
        if (x > max) {
          max = x;
        }
      }
    }

    const diff = this.totalPages - parseInt(pages[pages.length - 1], 10);
    if (diff >= 2) {
      pages.push('...');
    }

    for (let x = this.totalPages - 2; x <= this.totalPages; x++) {
      if (pages.indexOf('' + x) < 0) {
        pages.push('' + x);
        if (x > max) {
          max = x;
        }
      }
    }

    this.pages = [].concat(pages);
  }
}
