import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { DirectDebitService } from '../../data-access/services/direct-debit.service';

@Component({
  selector: 'direct-debit-applet-onboarding',
  standalone: true,
  imports: [CommonModule, DpIconComponent, NgxButtonComponent],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
  providers: [DirectDebitService],
})
export class OnboardingComponent {
  private readonly bottomSheet = inject<NgxBottomSheetService<any>>(NgxBottomSheetService);
  private readonly directDebit = inject(DirectDebitService);

  onClose() {
    this.directDebit.setShowOnboarding(false);
    this.bottomSheet.closeBottomSheet();
  }
}
