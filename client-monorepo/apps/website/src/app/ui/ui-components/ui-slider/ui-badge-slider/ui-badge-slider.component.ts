import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DragScrollComponent, DragScrollItemDirective } from 'ngx-drag-scroll';
import { UiOption } from '../../../models/ui-option';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-badge-slider',
  templateUrl: './ui-badge-slider.component.html',
  styleUrls: ['./ui-badge-slider.component.scss'],
  standalone: true,
  imports: [NgClass, DragScrollComponent, NgFor, DragScrollItemDirective],
})
export class UiBadgeSliderComponent implements OnChanges {
  @Input()
  badges: UiOption[] = [];

  @ViewChild('dragScrollComponent', {
    read: DragScrollComponent,
    static: false,
  })
  ds: DragScrollComponent;

  borderStatus: 'right' | 'both' | 'left' = 'right';

  scrollInitialized = false;

  @Output()
  itemSelected = new EventEmitter<any>();

  @Input()
  selectedItem = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.packageSubCategories && changes.packageSubCategories.currentValue) {
      this.scrollReachedEnd();
    }
  }

  scrollReachedEnd(): void {
    /*if (!this.ds) {
      return;
    }

    const div = this.ds._contentRef.nativeElement as HTMLDivElement;

    if (div.scrollLeft < 20) {
      this.borderStatus = 'right';
      return;
    } else {
      const diff = Math.abs(div.scrollLeft - (div.scrollWidth - div.getBoundingClientRect().width));
      if (diff >= 0 && diff <= 10) {
        this.borderStatus = 'left';
      } else {
        this.borderStatus = 'both';
      }
    }*/
  }

  scrollInitializedEvent(): void {
    this.scrollInitialized = true;
  }

  itemClick(sub: UiOption): void {
    this.selectedItem = sub.value;
    this.itemSelected.emit(sub);
  }
}
