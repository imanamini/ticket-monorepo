import {Component, Input, Output, EventEmitter, OnInit, inject} from '@angular/core';
import * as Sentry from "@sentry/angular-ivy";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input()
  headerTitle: string;
  @Input()
  headerCloseButtonType: 'NONE' | 'BACK' | 'EXIT' = 'EXIT';

  @Input()
  submitText: string;
  @Input()
  submitLoading: boolean;
  @Input()
  disableSubmitButton: boolean;
  @Input()
  amount: number;
  @Input()
  footerIconPath: string;
  @Output()
  submit: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  currencyText: string = 'مبلغ قابل پرداخت';
  @Input()
  hasFooter: boolean = true;
  @Input()
  customizeBackAction: boolean;
  @Output()
  onBackClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module')
  }
}
