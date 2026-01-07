import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';
import { Router } from '@angular/router';
import isEqual from 'lodash/isEqual';
import { ActivityInfo, PaymentResult } from '../../../../api/digipay/models/payment/payment-result';
import { MessageService } from '@client-monorepo/common/utilities';
import { ColorConverterService } from '@digipay/ng-lib-color-converter';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { UiCurrencyComponent } from '../../ui-formatters/ui-currency/currency.component';

@Component({
  selector: 'app-ui-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.scss'],
  standalone: true,
  imports: [UiCurrencyComponent, NgIf, ApiImageModule, NgFor, NgClass],
})
export class PaymentResultComponent implements OnInit, OnChanges {
  @Input()
  result: PaymentResult;

  @Input()
  closeButton = false;

  @Input()
  backButton = false;

  @Input()
  backButtonLink = '/';

  @Output()
  backButtonClick: EventEmitter<any> = new EventEmitter();

  backgroundColor: SafeStyle;

  message: SafeHtml;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private ms: MessageService,
  ) {}

  ngOnInit(): void {
    if (this.result) {
      this.makeValues();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.result &&
      changes.result.previousValue &&
      changes.result.currentValue &&
      !isEqual(changes.result.previousValue, changes.result.currentValue)
    ) {
      this.makeValues();
    }
  }

  makeMessage(): void {
    if (this.result.message) {
      this.message = this.result.message.replace(/<\/?body>|<\/?html>/gi, '');
    }
  }

  makeBackgroundImage(): void {
    if (this.result.color) {
      this.backgroundColor = this.sanitizer.bypassSecurityTrustStyle(ColorConverterService.convertDecimalToRgb(this.result.color));
    }
  }

  copyToClipboard(info: ActivityInfo) {
    if (!info.copyable) {
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(info.value).then(
        () => {
          this.ms.showErrorMessage('کپی شد');
        },
        (err) => {},
      );
    }
  }

  private makeValues(): void {
    this.makeBackgroundImage();
    this.makeMessage();
  }
}
