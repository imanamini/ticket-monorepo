import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';
import { WalletTransferModel } from '../../../data-access/models/wallet-transfer.model';
import { UserDetails } from '../../../data-access/models/user-details';
import { Subscription } from 'rxjs';
import { MessageService, stripSlash } from '@client-monorepo/common/utilities';
import { WalletApiClient } from '../../../data-access/services/wallet-api-client.service';
import { WalletPayService } from '@client-monorepo/applets/cash-in';
import { NgIf } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { UiAccountOwnerInfoComponent } from '../ui-account-owner-info/ui-account-owner-info.component';
import { WALLET_GTM_TAG, WalletGtmService } from '@client-monorepo/payment/wallet';

@Component({
  selector: 'cash-out-applet-wallet-amount',
  templateUrl: './wallet-amount.component.html',
  styleUrls: ['./wallet-amount.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    ReactiveFormsModule,
    PipesModule,
    UiFormFieldBuilderModule,
    FormsModule,
    NgxButtonComponent,
    PageLayoutComponent,
    UiAccountOwnerInfoComponent,
  ],
  standalone: true,
})
export class WalletAmountComponent {
  walletForm: UntypedFormGroup;
  isSubmitting = signal(false);
  initialized = signal(false);
  balance = 0;
  transferTicket: string | null = null;
  result: PaymentResult | null = null;
  transferProperty!: WalletTransferModel;
  hasError = true;

  targetUserDetails!: UserDetails;

  walletPaySubscription!: Subscription;

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private messageService: MessageService,
    private api: WalletApiClient,
    private walletPayService: WalletPayService,
    private walletGtm: WalletGtmService,
  ) {
    this.targetUserDetails = JSON.parse(<string>sessionStorage.getItem('USER_DETAIL'));
    this.walletForm = this.fb.group({
      amount: [''],
    });

    this.api.getWalletTransfer().subscribe(
      (transfer) => {
        this.transferProperty = transfer;
        this.walletForm.controls['amount'].setValidators([
          Validators.required,
          Validators.min(this.transferProperty.minAmount),
          Validators.max(this.transferProperty.maxAmount),
        ]);
        this.initialized.set(true);
      },
      (err) => {
        this.initialized.set(true);
        this.router.navigate(['service/wallet-transfer']);
        this.messageService.showErrorOfErrorResponse(err);
      },
    );
  }

  onSubmit(): void {
    this.walletGtm.publishEvent(WALLET_GTM_TAG.CASHOUT_TRANSFER_AMOUNT);

    this.isSubmitting.set(true);
    this.transferTicket = null;
    this.result = null;
    // stripe non-digit characters
    const amount = stripSlash(Number(this.walletForm.controls['amount'].value));
    if (!this.checkMaximumDailyCap(Number(amount), this.transferProperty.remainingCap)) {
      this.isSubmitting.set(false);
      this.messageService.showErrorMessage('مبلغ مورد نظر از حداکثر مبلغ قابل برداشت روزانه شما بیشتر است.');
      return;
    }

    this.api.getTransferTicket(amount, this.targetUserDetails.cellNumber).subscribe(
      (response) => {
        // store payment ticket for now
        sessionStorage.setItem('TICKET', response.ticket);
        this.transferTicket = response.ticket;
        this.startWalletPayFlow(response.ticket);
      },
      (e) => {
        this.isSubmitting.set(false);
        if (e.error.result.message) {
          this.messageService.showErrorOfErrorResponse(e);
        }
      },
    );
  }

  /**
   *
   * @param ticket
   */
  private startWalletPayFlow(ticket: string) {
    this.walletPayService.startPayFlow(ticket, 'wallet-transfer');
    this.walletPaySubscription = this.walletPayService.afterPay().subscribe((payResult) => {
      this.walletPayService.clear();
      if (payResult && payResult.result && payResult.result.status === 0) {
        this.walletPayService.goToPaymentResultPage(payResult);
      } else {
        this.messageService.showErrorOfErrorResponse(payResult);
        this.backButtonClick();
      }
      if (this.walletPaySubscription) {
        this.walletPaySubscription.unsubscribe();
      }
    });
  }

  backButtonClick() {
    this.router.navigateByUrl('/wallet-transfer', {
      state: {
        cellNumber: this.targetUserDetails.cellNumber,
        autoSubmit: false,
      },
    });
  }

  onInputError($event: any): void {
    this.hasError = $event;
  }

  private checkMaximumDailyCap(selectedNumber: number, remainingDailyCap: number): boolean {
    return selectedNumber <= remainingDailyCap;
  }
}
