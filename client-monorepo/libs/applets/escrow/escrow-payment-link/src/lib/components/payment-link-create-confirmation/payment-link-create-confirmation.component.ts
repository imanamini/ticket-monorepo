import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxIcon } from '@digipay/ngx-icon';
import { PaymentLinkDescriptionComponent } from '../payment-link-description/payment-link-description.component';
import { PaymentLinkDescriptionConfig } from '../../data-access/model/payment-link-description.model';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PaymentLinkApiService } from '../../data-access/api/payment-link-api.service';
import { finalize } from 'rxjs';
import { MessageService } from '@client-monorepo/common/utilities';
import { Router } from '@angular/router';

import { REDIRECT_URL_DIVAR } from '../../data-access/contracts/redirect-divar.const';
import { PaymentLinkResult } from '../../data-access/model/payment-link-create.model';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';

@Component({
  selector: 'escrow-payment-link-create-confirmation',
  standalone: true,
  imports: [CommonModule, NgxIcon, PaymentLinkDescriptionComponent, NgxButtonComponent],
  templateUrl: './payment-link-create-confirmation.component.html',
  styleUrl: './payment-link-create-confirmation.component.scss',
  providers: [PaymentLinkApiService],
})
export class PaymentLinkCreateConfirmationComponent {
  private readonly bottomSheet = inject(NgxBottomSheetService);
  private readonly api = inject(PaymentLinkApiService);
  private readonly message = inject(MessageService);
  private readonly router = inject(Router);
  private readonly storage = inject(EscrowStorageService);
  descriptionConfig: PaymentLinkDescriptionConfig = {
    headerTitle: 'توجه داشته باشید',
    descriptionEnum: ['مبلغ معامله، به حساب کسب‌وکار واریز خواهد شد.'],
  };
  loading = signal<boolean>(false);
  data = signal<PaymentLinkResult>(this.bottomSheet.data());
  time = computed(() => {
    return this.data().requestInfo.ttl / 60000;
  });
  onSubmit() {
    const { amount, description, requestId } = this.data().paymentLink;
    this.loading.set(true);
    this.api
      .create({ amount: Number(amount), description, requestId })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => {
          this.onCloseBottomSheet();
          this.router.navigate(['payment-link/result/success']);
          this.storage.setEscrowPaymentLinkDetail({ ...this.data() });
          this.bottomSheet.closeBottomSheet();
        },
        error: (error) => {
          this.message.showErrorOfErrorResponse(error);
          this.storage.setEscrowPaymentLinkDetail({ ...this.data() });
          this.router.navigate(['payment-link/result/error']);
          this.bottomSheet.closeBottomSheet();
        },
      });
  }

  onNavigate() {
    window.location.replace(REDIRECT_URL_DIVAR);
  }

  onCloseBottomSheet() {
    this.bottomSheet.closeBottomSheet();
  }
}
