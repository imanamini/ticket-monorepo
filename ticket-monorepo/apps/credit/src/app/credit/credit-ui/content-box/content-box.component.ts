import { Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { ContentBoxFooterDirective } from './marks/content-box-footer.directive';
import { CountdownEvent } from 'ngx-countdown';

@Component({
  selector: 'credit-ui-content-box',
  templateUrl: './content-box.component.html',
  styleUrls: ['./content-box.component.scss']
})
export class ContentBoxComponent implements OnInit {

  @Input() contentBoxTitle: string;

  @Input() showHeader: boolean = true;

  @Input() showLogo: boolean = true;

  @Input() countDown: number;

  @Output() countDownFinished = new EventEmitter();

  @Input() showBackButton = false;

  @Input() showCloseButton = false;

  @Output() backClick = new EventEmitter();

  @Input() bodyPadding = true;

  @Input() grayMode: boolean;

  @Input() headerBorderBottom: boolean = true;

  @Input() fullHeight: boolean = false;

  /**
   * Query for notices (errors, hints, etc.)
   */
  @ContentChildren(ContentBoxFooterDirective)
  footerItems: QueryList<ContentBoxFooterDirective>;

  constructor() {
  }

  ngOnInit() {
  }

  countdownHandler($event: CountdownEvent) {
    if ($event.action === 'done') {
      this.emitCountDownFinished();
    }
  }

  emitCountDownFinished() {
    this.countDownFinished.emit(true);
  }

  backIconClick() {
    this.backClick.emit();
  }

}
