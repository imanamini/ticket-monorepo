import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-orders-applet-order-summary',
  standalone: true,
  imports: [CommonModule, PipesModule, NgxButtonComponent],
  templateUrl: './order-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSummaryComponent {
  image = input('assets/images/product-default.png');
  linkText = input('');
  priceTitle = input('');
  price = input<number>();
  announcementTitle = input('');
  deliveryType = input<string>('0');
  linkAction = output();

  emitLinkAction(event: any) {
    this.linkAction.emit(event);
  }
}
