import { ChangeDetectionStrategy, Component, effect, input, OnInit, signal, untracked } from '@angular/core';
import { ContractInstallmentSummary } from '../../../data-access/models/credit/installment/contract-installment-summary';
import { AggregationInstallmentFields, Installment } from '../../../data-access/models/credit/installment/installment';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CONTRACT_DEBT_STATUS_CARD_CLASS } from '../../../data-access/models/credit/installment/contract-debt-status';
import { CreditInstallmentPaymentService } from '../../../data-access/services/credit-installment-payment.service';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditInstallmentItemComponent } from '../../credit-installment-item/credit-installment-item.component';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-credit-wallet-contract-card',
  templateUrl: './credit-wallet-contract-card.component.html',
  styleUrls: ['./credit-wallet-contract-card.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, CreditInstallmentItemComponent, PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditWalletContractCardComponent implements OnInit {
  creditId = input.required<string>();

  contract = input<ContractInstallmentSummary>();

  fundProviderCode = input.required<number>();

  totalInstallmentCount = input<number>();

  aggregationEnabled = input<boolean>();

  maxPaymentAmount = input<number>();

  statusCardClassMap = CONTRACT_DEBT_STATUS_CARD_CLASS;
  payableInstallment = signal<Installment[] | null>(null);
  isSingleInstallment = signal<boolean | null>(null);

  constructor(
    private router: Router,
    private creditUrlService: CreditUrlService,
    private installmentPaymentService: CreditInstallmentPaymentService,
  ) {
    effect(
      () => {
        const contractValue = this.contract();
        if (contractValue) {
          untracked(() => {
            this.setPayableInstallment();
          });
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.setPayableInstallment();
  }

  setPayableInstallment() {
    this.payableInstallment.set(null);
    if (!this.contract()) {
      return;
    }
    let totalInstallmentOfContract = 0;
    this.contract()?.installmentGroups.forEach((group) => {
      if (group.payable) {
        this.payableInstallment.set(group.installments!);
      }
      totalInstallmentOfContract += group.installments && group.installments.length ? group.installments.length : 0;
    });
    this.isSingleInstallment.set(totalInstallmentOfContract === 1);
  }

  onPay() {
    const options: AggregationInstallmentFields[] = [
      {
        trackingCode: this.contract()?.contractTrackingCode!,
        count: 1,
        amount: this.payableInstallment()![0].totalAmount,
      },
    ];
    if (options[0].amount > (this.maxPaymentAmount() ?? 0)) {
      return this.installmentPaymentService.outOfRangeAmountHandler();
    }
    const optionsStringified = JSON.stringify(options);
    this.router
      .navigateByUrl(this.creditUrlService.getInnerServicePath(`/installment/pay/${this.creditId()}?options=${optionsStringified}`))
      .then();
  }
}
