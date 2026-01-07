import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';

@Component({
  selector: 'escrow-home-applet-seller-onboarding-order',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './seller-onboarding-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerOnboardingOrderComponent {
  showDeliveryMessageBottomSheet = signal<boolean>(false);
  bottomSheetService = inject(NgxBottomSheetService);
  storageService = inject(EscrowStorageService);

  setShowDeliveryMessageBottomSheet() {
    this.showDeliveryMessageBottomSheet.set(!this.showDeliveryMessageBottomSheet());
  }

  closeOnboarding() {
    this.storageService.setEscrowSellerOnboarding(true);
    this.bottomSheetService.closeBottomSheet();
  }
}
