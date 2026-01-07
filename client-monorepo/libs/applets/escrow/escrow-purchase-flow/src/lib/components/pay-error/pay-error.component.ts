import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';

@Component({
  selector: 'escrow-purchase-flow-applet-pay-error',
  standalone: true,
  imports: [CommonModule, NgxStatusResultModule],
  templateUrl: './pay-error.component.html',
  styles: `
    .pay-error {
      height: 100% !important;
      position: absolute !important;
      z-index: 9999999999 !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayErrorComponent {}
