import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { GetWalletName } from '../../../wallet/services/get-wallet-name';

@Component({
  selector: 'wealth-applet-swap-confirmation-bottomsheet',
  standalone: true,
  imports: [CommonModule, NgxIcon, NgxButtonComponent],
  templateUrl: './swap-confirmation-bottomsheet.component.html',
  styleUrl: './swap-confirmation-bottomsheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwapConfirmationBottomsheetComponent implements OnInit {
  getWalletName = GetWalletName;
  data = signal<{ origin: string; destination: string } | undefined>(undefined);
  origin = computed(() => {
    return this.getWalletName(this.data().origin);
  });
  destination = computed(() => {
    return this.getWalletName(this.data().destination);
  });

  private bottomsheetService = inject(NgxBottomSheetService);

  ngOnInit(): void {
    this.data.set(this.bottomsheetService.data().data);
  }

  handleAction(action: 'cancel' | 'continue') {
    this.bottomsheetService.outputData.set(action);
    this.bottomsheetService.closeBottomSheet();
  }
}
