import { ChangeDetectionStrategy, Component, computed, inject, Inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { MessageService } from '../../data-access/services/message.service';
import { CreditRouteStateInterface } from '../../data-access/services/route-state/credit-route-state.interface';
import { CreditUrlService } from '../../data-access/utils/url';
import { ContractSummary, Installment } from '../../data-access/models/credit/contracts/credit-contract-list.response';
import moment from 'jalali-moment';
import { CreditPaymentService } from '../../data-access/services/credit-payment.service';
import { CreditWallet } from '../../data-access/models/credit/wallet/credit-wallet.model';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditInstallmentCardComponent } from '../../components/credit-installment-card/credit-installment-card.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-installment-pay-confirm-neo',
  templateUrl: './installment-pay-confirm-neo.component.html',
  styleUrls: ['./installment-pay-confirm-neo.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, CreditInstallmentCardComponent, NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallmentPayConfirmNeoComponent {
  imageId = signal<string | null>(null);
  fundProviderCode!: number;
  creditId!: string;
  wallet = signal<CreditWallet | null>(null);
  installment = signal<Installment | null>(null);
  installmentDate = computed(() => (this.installment() ? moment(this.installment()?.date).format('jYYYY/jMM/jDD') : null));
  contract!: ContractSummary;
  paying = signal(false);

  private router = inject(Router);
  private creditService = inject(CreditApiService);
  private messageService = inject(MessageService);
  private creditPaymentService = inject(CreditPaymentService);
  private creditUrlService = inject(CreditUrlService);

  constructor(
    @Inject('RouteStateInterface')
    private routeStateService: CreditRouteStateInterface,
  ) {
    const state = this.routeStateService.getAll();

    if (!state.installment) {
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
      return;
    }

    this.wallet.set(state.wallet);
    this.installment.set(state.installment);
    this.fundProviderCode = state.wallet.fundProviderCode;
    this.creditId = state.wallet.creditId;
    this.contract = state.contract;
    this.imageId.set(state.contract.imageId);
  }

  /**
   * Confirmed callback
   * Gets ticket and opens the pay method bottom sheet
   */
  confirmed() {
    if (this.paying()) {
      return;
    }
    this.paying.set(true);
    const payload: any = {
      ticketRequestDetails: [
        {
          trackingCode: this.contract.trackingCode,
          count: 1,
          amount: this.installment()?.amount,
        },
      ],
    };
    const callbackUrl = this.creditUrlService.getPaymentTicketCallbackUrl('credit');
    this.creditService.getTicketForInstallmentPay(payload, callbackUrl).subscribe({
      next: (r) => {
        this.paying.set(false);
        this.creditPaymentService.pay('credit', r.ticket, this.installment()?.amount).then();
      },
      error: (e) => {
        this.paying.set(false);
        this.messageService.showErrorOfErrorResponse(e);
      },
    });
  }

  /**
   * Back button clicked
   */
  backButtonClicked() {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/wallet/detail/${this.fundProviderCode}/${this.creditId}`));
  }
}
