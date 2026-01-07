import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Router } from '@angular/router';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'digipay-card-applet-cash-in-and-payment-confirmation',
  standalone: true,
  imports: [CommonModule, DpIconComponent, NgxButtonComponent],
  templateUrl: './cash-in-and-payment-confirmation.component.html',
  styleUrl: './cash-in-and-payment-confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashInAndPaymentConfirmationComponent {
  bottomSheetService = inject(NgxBottomSheetService);

  approve() {
    this.bottomSheetService.outputData.set(null);
    this.bottomSheetService.closeBottomSheet();
  }
}
