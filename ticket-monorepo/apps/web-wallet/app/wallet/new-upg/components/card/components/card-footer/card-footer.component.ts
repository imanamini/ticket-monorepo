import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as Sentry from "@sentry/angular-ivy";

@Component({
  selector: 'app-card-footer',
  templateUrl: './card-footer.component.html',
  styleUrls: ['./card-footer.component.scss']
})
export class CardFooterComponent implements OnInit{
  @Input()
  submitText: string;
  @Input()
  submitLoading: boolean;
  @Input()
  disableButton: boolean;
  @Input()
  amount: number;
  @Input()
  iconPath: string;
  @Input()
  currencyText: string = 'مبلغ قابل پرداخت';

  @Output()
  onSubmit: EventEmitter<any> = new EventEmitter<any>();

  weAreInBadArrange = false;

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module');
  }

  ngOnInit() {
    this.decideForPreview();
  }

  decideForPreview(): void {
    if (this.submitText === 'افزایش موجودی و پرداخت' && window.innerWidth < 330) {
      this.weAreInBadArrange = true;
    }
  }
}
