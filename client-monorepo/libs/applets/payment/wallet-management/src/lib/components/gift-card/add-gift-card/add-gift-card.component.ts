import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WalletManagementApiService } from '../../../data-access/services/wallet-management-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { RedeemResponseInterface } from '../../../data-access/models/redeem.interface';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';
import { CashInApisService } from '../../../data-access/services/cash-in-apis.service';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UppercaseDirective } from '../../../data-access/directives/uppercase.directive';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { ReloadAlertService } from '../../../data-access/services/reload-alert.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { WALLET_GTM_TAG, WalletGtmService } from '@client-monorepo/payment/wallet';

@Component({
  selector: 'wallet-mng-applet-add-gift-card',
  templateUrl: './add-gift-card.component.html',
  styleUrls: ['./add-gift-card.component.scss'],
  providers: [CashInApisService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, UiFormFieldBuilderModule, UppercaseDirective, NgxButtonComponent, NgxSpinnerModule],
  standalone: true,
})
export class AddGiftCardComponent {
  public loadingApi = signal<boolean>(false);
  public errorMessage = null;
  public form = new FormGroup({
    voucherCode: new FormControl('', [Validators.required, Validators.pattern(/[A-Z0-9]{8}/)]),
  });

  private api = inject(WalletManagementApiService);
  private message = inject(MessageService);
  private router = inject(Router);
  private cashInApi = inject(CashInApisService);
  private reloadAlertService = inject(ReloadAlertService);
  private bottomSheet = inject(NgxBottomSheetService);
  private readonly gtmWallet = inject(WalletGtmService);

  public onSubmit(): void {
    this.loadingApi.set(true);
    this.redeemVouchers();

    this.gtmWallet.publishEvent(WALLET_GTM_TAG.GIFT_MNG_SEARCH);
  }

  public handleCloseBottomSheet(newItemAdded = false): void {
    this.bottomSheet.outputData.set(newItemAdded);
    this.bottomSheet.closeBottomSheet();
  }

  public navigateToQrCodeReader(): void {
    this.bottomSheet.closeBottomSheet();
    this.router.navigate(['/wallet-management/gift-card-qr-code-reader']).then();

    this.gtmWallet.publishEvent(WALLET_GTM_TAG.WALLET_MNG_CAMERA);
  }

  private redeemVouchers(): void {
    this.api
      .redeemVouchers(this.form.controls['voucherCode'].value)
      .pipe(finalize(() => this.loadingApi.set(false)))
      .subscribe({
        next: (result: RedeemResponseInterface) => {
          this.reloadAlertService.reload.next({ change: true });
          this.message.showSuccessMessage(result.result.message);
          this.handleCloseBottomSheet(true);
        },
        error: (error) => {
          if (error?.error?.result?.title === 'GIFT_VOUCHER_NOT_FOUND') {
            this.consumeVoucherCode();
            return;
          }
          this.message.showErrorOfErrorResponse(error);
        },
      });
  }

  private consumeVoucherCode() {
    this.cashInApi.consumeVoucherCode(this.form.controls['voucherCode'].value).subscribe({
      next: (result: any) => {
        this.reloadAlertService.reload.next({ change: true });
        this.handleSuccessResponse(result);
      },
      error: (error: any) => {
        this.message.showErrorOfErrorResponse(error);
      },
    });
  }

  private handleSuccessResponse(result: PaymentResult | RedeemResponseInterface) {
    this.reloadAlertService.reload.next({ change: true });
    this.message.showSuccessMessage(result.result.message);
    this.handleCloseBottomSheet(true);
  }
}
