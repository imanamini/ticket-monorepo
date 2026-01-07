import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'lib-contract-create-confirmation',
  standalone: true,
  imports: [CommonModule, NgxIcon, NgxButtonComponent],
  templateUrl: './contract-create-confirmation.component.html',
  styleUrl: './contract-create-confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractCreateConfirmationComponent {
  private readonly bottomSheetService = inject(NgxBottomSheetService);

  onSubmit() {
    this.bottomSheetService.outputData.set(true);
    this.bottomSheetService.closeBottomSheet();
  }
}
