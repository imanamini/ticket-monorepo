import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AnalyticsId } from '../../../api/models/analytics-id';

@Component({
  selector: 'ui-content-card',
  templateUrl: './ui-content-card.component.html',
  styleUrls: ['./ui-content-card.component.scss'],
})
export class UiContentCardComponent implements OnInit, OnDestroy {

  @Input()
  id: AnalyticsId;

  @Input()
  theme: 'default' | 'secondary' = 'default';

  @Input()
  hasHeader = true;

  @Input()
  title = '';

  @Input()
  amount: number;

  @Input()
  hasHeaderAction = false;

  @Input()
  hasHeaderLogo = true;

  @Input()
  hasBackAction = false;

  @Input()
  hasRejectAction = false;

  @Input()
  confirmButtonDisable: boolean;

  @Input()
  rejectButtonDisable: boolean;

  @Input()
  showConfirmButtonRemaining = false;

  @Input()
  confirmButtonTitle: string;

  @Input()
  rejectButtonTitle = 'انصراف';

  @Input()
  confirmButtonRemainingTime = 0;

  @Input()
  confirmButtonFullWidth = false;

  @Input()
  headerRemainingTime = 0;

  @Input()
  hasHeaderBackAction = false;

  @Input()
  hasFooter = true;

  @Input()
  extraLinkTitle: string;

  @Input()
  extraLinkMobileTitle: string;

  @Input()
  hasPoweredLogo = true;

  @Input()
  footerDetailLabel = 'مبلغ پرداختی از کیف‌پول';

  @Input()
  integratedFooter = false;

  @Input()
  footerIconPath: string = '';

  @Output()
  confirm = new EventEmitter<any>();

  @Output()
  reject = new EventEmitter<any>();

  @Output()
  back = new EventEmitter<any>();

  @Output()
  finishedConfirmRemaining = new EventEmitter<any>();

  @Output()
  finishedHeaderRemaining = new EventEmitter<any>();

  @Output()
  headerBackActionClicked = new EventEmitter();

  @Output()
  extraLinkClicked = new EventEmitter();

  @Output()
  headerCloseActionClicked = new EventEmitter();

  @Input()
  headerRemainingTimeSecond = 0;
  @Output()
  finishTimer: EventEmitter<any> = new EventEmitter<any>();

  viewportHeight = 0;

  @Input()
  timeType : 'MILLI_SECOND' | 'SECOND' | 'MINUTE' = 'SECOND';

  constructor() {
    this.windowResizeCallback = this.windowResizeCallback.bind(this);
  }

  @ViewChild('uiContentCard', {
    static: false
  })
  uiContentCard: ElementRef<HTMLDivElement>;

  ngOnInit() {
    if (!this.extraLinkMobileTitle) {
      this.extraLinkMobileTitle = this.extraLinkTitle;
    }
    this.windowResizeCallback();
    window.addEventListener('resize', this.windowResizeCallback);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.windowResizeCallback);
  }

  windowResizeCallback() {
    this.viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    setTimeout(() => {
      if (this.extraLinkTitle && this.hasPoweredLogo) {
        this.uiContentCard.nativeElement.style.maxHeight = this.viewportHeight + 'px';
      }
    }, 10);
  }

  onConfirm() {
    this.confirm.emit();
  }

  onReject() {
    this.reject.emit();
  }

  headerBackAction() {
    this.headerBackActionClicked.emit();
  }

  onFinishedConfirmRemaining() {
    this.finishedConfirmRemaining.emit();
  }

  emitCountDownFinish() {
    this.finishedHeaderRemaining.emit(true);
  }

  extraLinkClick() {
    this.extraLinkClicked.emit();
  }

  headerCloseAction() {
    this.headerCloseActionClicked.emit();
  }
}
