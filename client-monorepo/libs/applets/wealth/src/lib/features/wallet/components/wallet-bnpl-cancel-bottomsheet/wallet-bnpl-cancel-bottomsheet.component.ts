import { CommonModule } from '@angular/common';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';

export type SheetAction = 'CONFIRM' | 'CANCEL';

export interface SheetOutput {
  action: SheetAction;
}

@Component({
  selector: 'wealth-applet-wallet-bnpl-cancel-bottomsheet',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './wallet-bnpl-cancel-bottomsheet.component.html',
  styleUrl: './wallet-bnpl-cancel-bottomsheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBnplCancelBottomsheetComponent implements OnInit {
  data = signal<{ walletName: string } | undefined>(undefined);
  bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit() {
    this.data.set(this.bottomSheetService.data());
  }

  actionClick(action: SheetAction) {
    this.bottomSheetService.outputData.set({ action } as SheetOutput);
    this.bottomSheetService.closeBottomSheet();
  }
}
