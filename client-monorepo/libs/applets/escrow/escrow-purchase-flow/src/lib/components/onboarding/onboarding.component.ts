import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';

@Component({
  selector: 'escrow-purchase-flow-applet-onboarding',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './onboarding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingComponent implements OnInit {
  bottomSheetService = inject(NgxBottomSheetService);
  storageService = inject(EscrowStorageService);

  ngOnInit() {
    this.storageService.setEscrowBottomSheetOnboarding(true);
  }

  closeBottomSheet() {
    this.bottomSheetService.closeBottomSheet();
  }
}
