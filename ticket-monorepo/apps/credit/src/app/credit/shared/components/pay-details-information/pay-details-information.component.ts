import {
  Component,
  ElementRef,
  EventEmitter, HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { DisabledWalletMessage } from '../../../api/purchase/credit-wallet.model';

export interface DetailContentRow {
  title: string,
  value: number,
  tooltip?: string,
}

export interface DetailContent {
  footerTitle: string,
  footerAmount: number,
  rows: DetailContentRow[],
}

export interface FooterContent {
  icon: 'credit' | 'cash',
  title: string,
  amount: number,
  extraTitle?: string,
}

@Component({
  selector: 'app-pay-details-information',
  templateUrl: './pay-details-information.component.html',
  styleUrls: ['./pay-details-information.component.scss']
})
export class PayDetailsInformationComponent implements OnChanges {

  @Input() detailContents: DetailContent[];

  @Input() footerContents: FooterContent[];

  @Input() totalPayableAmount: number;

  @Input() footerDescription: string;

  @Input() footerActionTitle: string;

  @Input() disabled: boolean;

  @Input() disabledMessages: DisabledWalletMessage[] = [];

  @Input() loading: boolean;

  @Input() otpLoading: boolean;

  @Input() disableEditAmount: boolean;

  @Output() edit = new EventEmitter();

  @Output() actionClicked = new EventEmitter();

  @ViewChild('bodyContent') bodyContent: ElementRef;

  showDetails: boolean = false;
  bodyContentHeight: number;

  constructor() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyContentHeight = this.bodyContent.nativeElement.offsetHeight;
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      this.bodyContentHeight = this.bodyContent.nativeElement.offsetHeight;
    }, 0);
  }

  editAmount() {
    this.edit.emit();
  }

  onClick() {
    this.actionClicked.emit();
  }
}
