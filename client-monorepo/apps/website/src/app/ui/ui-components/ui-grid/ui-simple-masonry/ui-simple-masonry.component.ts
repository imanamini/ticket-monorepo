import { AfterContentInit, Component, ContentChildren, Input, OnChanges, QueryList, SimpleChanges } from '@angular/core';
import { UiGridItemDirective } from '../directives/ui-grid-item.directive';
import { Subscription } from 'rxjs';
import { NgFor, NgStyle, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-ui-simple-masonry',
  templateUrl: './ui-simple-masonry.component.html',
  styleUrls: ['./ui-simple-masonry.component.scss'],
  standalone: true,
  imports: [NgFor, NgStyle, NgTemplateOutlet],
})
export class UiSimpleMasonryComponent implements OnChanges, AfterContentInit {
  @Input()
  columns = 4;

  @Input()
  gap = 16;

  @Input()
  equalHeight: boolean;

  @ContentChildren(UiGridItemDirective)
  items!: QueryList<UiGridItemDirective>;

  subscription: Subscription;

  columnsArray: Array<UiGridItemDirective[]> = [];

  rowsArray: Array<UiGridItemDirective[]> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns && changes.columns.currentValue) {
      this.makeColumns();
    }
  }

  ngAfterContentInit(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.items.length > 0) {
      this.makeColumns();
    }
    this.subscription = this.items.changes.subscribe((changes) => {
      this.makeColumns();
    });
  }

  private makeColumns(): void {
    const columns = [];
    let ci = 0;
    const maxCi = this.columns - 1;
    if (!this.items) {
      return;
    }

    this.items.forEach((item) => {
      if (!Array.isArray(columns[ci])) {
        columns[ci] = [];
      }
      columns[ci].push(item);
      if (ci === maxCi) {
        ci = 0;
      } else {
        ci++;
      }
    });
    this.columnsArray = columns;

    // const rows = [];
    // let rowIndex = 0;
    // this.items.forEach(item => {
    //   if (!Array.isArray(rows[rowIndex])) {
    //     rows[rowIndex] = [];
    //   }
    //   rows[rowIndex].push(item);
    //   if (rowIndex === maxCi) {
    //     rowIndex = 0;
    //   } else {
    //     rowIndex++;
    //   }
    // });
    // this.rowsArray = rows;
  }
}
