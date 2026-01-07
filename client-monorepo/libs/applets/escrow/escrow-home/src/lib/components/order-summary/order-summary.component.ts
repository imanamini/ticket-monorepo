import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-home-applet-order-summary',
  standalone: true,
  imports: [CommonModule, PipesModule, NgxButtonComponent],
  templateUrl: './order-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSummaryComponent {
  image = input('assets/images/product-default.png');
  linkText = input('');
  priceTitle = input('');
  price = input<string | number>('');
  announcementTitle = input('');
  deliveryType = input<string>('');
  linkAction = output();

  emitLinkAction(event: any) {
    this.linkAction.emit(event);
  }
}
