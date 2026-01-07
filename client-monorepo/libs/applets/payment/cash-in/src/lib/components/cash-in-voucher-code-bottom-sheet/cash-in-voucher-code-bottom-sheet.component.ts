import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { MessageService } from '@client-monorepo/common/utilities';
import { finalize } from 'rxjs/operators';
import { CashInVoucherCodeComponent } from '../cash-in-voucher-code/cash-in-voucher-code.component';
import { FormNoticeComponent } from '../form-notice/text-field-notice.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { WalletManagementApiService } from '../../data-access/services/wallet-management-api.service';
import { CashInApisService } from '../../data-access/services/cash-in-apis.service';
import { RedeemResponseInterface } from '../../data-access/models/redeem.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { WALLET_GTM_TAG, WalletGtmService } from '@client-monorepo/payment/wallet';

@Component({
  selector: 'cash-in-applet-cash-in-voucher-code-bottom-sheet',
  templateUrl: './cash-in-voucher-code-bottom-sheet.component.html',
  styleUrls: ['./cash-in-voucher-code-bottom-sheet.component.scss'],
  providers: [WalletManagementApiService],
  standalone: true,
  imports: [CashInVoucherCodeComponent, FormNoticeComponent, NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashInVoucherCodeBottomSheetComponent {
  code = '';

  codeError: string | null = '';

  checkingCode = false;
  private bottomSheet = inject(NgxBottomSheetService);
  private walletGtm = inject(WalletGtmService);

  constructor(
    private cashInApis: CashInApisService,
    private messageService: MessageService,
    private changeDetectorRef: ChangeDetectorRef,
    private walletApi: WalletManagementApiService,
  ) {}

  onConfirm() {
    if (!this.code) {
      this.bottomSheet.outputData.set({
        confirmed: false,
      });
      this.bottomSheet.closeBottomSheet();
    } else {
      this.walletGtm.publishEvent(WALLET_GTM_TAG.CASHIN_GIFT_SEARCH);
      this.codeError = null;
      this.checkingCode = true;
      this.walletApi
        .redeemVouchers(this.code)
        .pipe(
          finalize(() => {
            this.checkingCode = false;
          }),
        )
        .subscribe({
          next: (result: RedeemResponseInterface) => {
            this.messageService.showSuccessMessage('کد هدیه با موفقیت ثبت شد.');
            this.bottomSheet.outputData.set({
              confirmed: true,
            });
            this.bottomSheet.closeBottomSheet();
          },
          error: (err) => {
            if (err.error.result?.title === 'GIFT_VOUCHER_NOT_FOUND') {
              this.consumeVoucherCode();
              return;
            }
            this.messageService.showErrorOfErrorResponse(err);
          },
        });
    }
  }

  consumeVoucherCode() {
    this.cashInApis.consumeVoucherCode(this.code).subscribe(
      (r) => {
        this.bottomSheet.outputData.set({
          confirmed: true,
          result: r,
          code: this.code,
        });
        this.bottomSheet.closeBottomSheet();
      },
      (e) => {
        this.checkingCode = false;
        this.codeError = e.error.result?.message;
        if (!this.codeError) {
          this.codeError = 'بروز خطا! لطفا مجددا تلاش کنید';
        }
        this.changeDetectorRef.detectChanges();
      },
    );
  }
}
