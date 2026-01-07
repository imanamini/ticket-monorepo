import { ChangeDetectionStrategy, Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import * as Sentry from '@sentry/angular-ivy';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'payment-checkout-card-footer',
  standalone: true,
  imports: [CommonModule, PipesModule, NgxSkeletonLoadingComponent, NgxButtonComponent],
  templateUrl: './card-footer.component.html',
  styleUrls: ['./card-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardFooterComponent implements OnInit {
  @Input()
  submitText!: string;
  @Input()
  submitLoading = false;
  @Input()
  disableButton = false;
  @Input()
  amount!: number;
  @Input()
  iconPath!: string;
  @Input()
  currencyText = 'مبلغ قابل پرداخت';
  footerLoading = input(false);

  @Output()
  submittedButton: EventEmitter<any> = new EventEmitter<any>();

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
