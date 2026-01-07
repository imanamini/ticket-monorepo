import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgForOf } from '@angular/common';
import { WalletManagementApiService } from '../../data-access/services/wallet-management-api.service';
import { VoucherDetail } from '../../data-access/models/voucher.response.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'wallet-mng-applet-expired-vouchers',
  templateUrl: './expired-vouchers.component.html',
  styleUrls: ['./expired-vouchers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PipesModule, NgxButtonComponent, NgForOf],
  standalone: true,
})
export class ExpiredVouchersComponent implements OnInit {
  private walletManagementApiService = inject(WalletManagementApiService);
  private bottomSheet = inject(NgxBottomSheetService)
  bottomSheetState: VoucherDetail[]

  constructor() {
    this.bottomSheetState = this.bottomSheet.data().data
  }

  close(): void {
    this.bottomSheet.closeBottomSheet();
  }

  ngOnInit() {
    for (const item of this.bottomSheetState) {
      this.walletManagementApiService.hideExpiredVouchers(item.serial).subscribe(() => {});
    }
  }
}
