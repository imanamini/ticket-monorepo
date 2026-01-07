import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, input, computed } from '@angular/core';
import * as Sentry from '@sentry/angular-ivy';
import { CommonModule } from '@angular/common';
import { CardHeaderComponent } from './components/card-header/card-header.component';
import { CardFooterComponent } from './components/card-footer/card-footer.component';

@Component({
  selector: 'payment-checkout-app-card',
  standalone: true,
  imports: [CommonModule, CardHeaderComponent, CardFooterComponent],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  headerTitle = input<string>('');
  headerCloseButtonType = input<'NONE' | 'BACK' | 'EXIT'>('EXIT');
  submitText = input<string>('');
  submitLoading = input<boolean>(false);
  footerLoading = input<boolean>(false);
  disableSubmitButton = input<boolean>(false);
  amount = input<number>(0);
  footerIconPath = input<string>('');
  isBottomSheet = input<boolean>(false);
  containerStyle = computed(() => {
    return {
      height: this.isBottomSheet() ? 'auto' : '100vh',
      maxHeight: this.isBottomSheet() ? '85vh' : 'unset',
    };
  });
  bodyStyle = computed(() => {
    return {
      margin: this.isBottomSheet() ? 'unset' : '50px 0 85px 0',
    };
  });
  hasFooter = input<boolean>(true);

  @Output()
  clickedButton: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  currencyText = 'مبلغ قابل پرداخت';
  @Input()
  customizeBackAction = false;
  @Output()
  clickedOnBack: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module');
  }
}
