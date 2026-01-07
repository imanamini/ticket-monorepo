import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { FormsModule } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-cheque-confirm-bottom-sheet',
  templateUrl: './cheque-confirm-bottom-sheet.component.html',
  styleUrls: ['./cheque-confirm-bottom-sheet.component.scss'],
  standalone: true,
  imports: [NgxSkeletonLoadingComponent, FormsModule, NgxButtonComponent, NgxTooltipDirective, NgxCheckboxComponent, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChequeConfirmBottomSheetComponent {
  accepted = signal<boolean>(false);
  warningShake = signal<boolean | null>(null);

  bottomSheetService = inject(NgxBottomSheetService);

  onSubmit(): void {
    if (!this.accepted()) {
      this.runWarningShake();
      return;
    }
    this.bottomSheetService.outputData.set({ confirmed: true });
    this.bottomSheetService.closeBottomSheet();
  }

  runWarningShake(): void {
    this.warningShake.set(true);
    setTimeout(() => {
      this.warningShake.set(false);
    }, 400);
  }
}
