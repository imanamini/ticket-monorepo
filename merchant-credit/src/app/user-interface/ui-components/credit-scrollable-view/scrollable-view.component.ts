import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { isMacOs, supportsTouch } from '../../../utils/device';

@Component({
  selector: 'app-scrollable-view',
  templateUrl: './scrollable-view.component.html',
  styleUrls: ['./scrollable-view.component.scss']
})
export class ScrollableViewComponent implements  AfterViewInit {

  @Input()
  withPadding = false;

  @Input()
  fullHeightContent = false;

  @Input()
  hasFade: boolean = false;

  @Input()
  disabled: boolean = false;

  @Input()
  fadeColor: 'white' | 'gray' = 'white';

  @Input()
  leftScrollbarPosition: boolean = false;

  @Output() scroll = new EventEmitter();

  @ViewChild(NgScrollbar, {static: true}) scrollbarRef?: NgScrollbar;
  disableCustomScroll: boolean = !!(supportsTouch() || isMacOs());

  ngAfterViewInit(): void {
    if (this.scrollbarRef) {
      this.scrollbarRef.scrolled.subscribe($event => {
        this.scroll.emit($event);
      });
    }
  }
}
