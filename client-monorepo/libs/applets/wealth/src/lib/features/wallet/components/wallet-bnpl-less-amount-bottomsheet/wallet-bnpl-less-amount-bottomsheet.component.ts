import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'wealth-applet-wallet-bnpl-less-amount-bottomsheet',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, PipesModule],
  templateUrl: './wallet-bnpl-less-amount-bottomsheet.component.html',
  styleUrl: './wallet-bnpl-less-amount-bottomsheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBnplLessAmountBottomsheetComponent {
  bottomSheet = inject<NgxBottomSheetService<any>>(NgxBottomSheetService);

  gotIt() {
    this.bottomSheet.closeBottomSheet();
  }
}
