import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { IProcessData } from '../../models/wallet-process.interface';
import { BnplBannerComponent } from '../../../../shared/components/bnpl-banner/bnpl-banner/bnpl-banner.component';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'wealth-applet-wallet-bnpl-bottomsheet',
  standalone: true,
  imports: [BnplBannerComponent, NgxButtonComponent],
  templateUrl: './wallet-bnpl-bottomsheet.component.html',
  styleUrl: './wallet-bnpl-bottomsheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBnplBottomsheetComponent implements OnInit {
  loading = signal<boolean>(false);
  data = signal<IProcessData | undefined>(undefined);
  bottomSheet = inject<NgxBottomSheetService<any>>(NgxBottomSheetService);

  ngOnInit(): void {
    this.data.set(this.bottomSheet.data().data);
  }

  getBnpl() {
    this.loading.set(true);
    this.bottomSheet.outputData.set({ confirmed: true, ...this.data() });
    this.bottomSheet.closeBottomSheet();
  }

  close(): void {
    this.bottomSheet.closeBottomSheet();
  }
}
