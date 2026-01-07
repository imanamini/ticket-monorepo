import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'wealth-applet-wallet-bnpl-extera-credit-detail',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './wallet-bnpl-extera-credit-detail.component.html',
  styleUrl: './wallet-bnpl-extera-credit-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBnplExteraCreditDetailComponent {
  private bottomSheetService = inject(NgxBottomSheetService);

  closeBottomSheet() {
    this.bottomSheetService.closeBottomSheet();
  }
}
