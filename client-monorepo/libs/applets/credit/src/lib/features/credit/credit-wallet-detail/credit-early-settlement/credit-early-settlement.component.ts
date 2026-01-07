import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import {
  CreditEarlySettlementDetailResponse,
  InstallmentPreview,
} from '../../data-access/models/credit/installment/credit-early-settlement-detail.response';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { CUSTOMER_TYPE } from '../../data-access/models/credit/installment/customer-type';
import { BNPL_TYPE } from '../../data-access/models/credit/installment/bnpl-type';
import { getMonthTitle, isStartAndEndOfMonth } from '../../data-access/utils/date';
import { currencyFormat } from '@digipay/strings';
import { CreditEarlySettlementChangeAmountDialogComponent } from './credit-early-settlement-change-amount/credit-early-settlement-change-amount';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditEarlySettlementInfoCardsComponent } from './credit-early-settlement-info-cards/credit-early-settlement-info-cards.component';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';

interface InstallmentFormatted {
  date: string;
  order: string;
  amountTitle: string;
}

@Component({
  selector: 'app-credit-early-settlement',
  templateUrl: './credit-early-settlement.component.html',
  styleUrls: ['./credit-early-settlement.component.scss'],
  standalone: true,
  imports: [CreditEarlySettlementInfoCardsComponent, NgxButtonComponent, NgxIcon, NgxCalloutComponent, PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEarlySettlementComponent implements OnInit {
  creditId = input.required<string>();
  customerType = input<CUSTOMER_TYPE>();
  bnplType = input<BNPL_TYPE>();
  data = signal<CreditEarlySettlementDetailResponse | null>(null);
  redirecting = signal<boolean | null>(null);
  gettingData = signal<boolean | null>(null);
  installmentsDetailIsOpen = signal<boolean>(true);
  detailElementHeight = signal<number | null>(null);
  heightSet = signal<boolean>(false);
  installmentsFormatted = signal<InstallmentFormatted[]>([]);

  detailElement = viewChild<ElementRef | null>('detail');

  earlySettleTitle = computed<string>(() => {
    if (this.data()?.billingCycleStartDate && this.data()?.billingCycleEndDate) {
      const startDate = this.data()!.billingCycleStartDate;
      const endDate = this.data()!.billingCycleEndDate;

      const alongAMonth = isStartAndEndOfMonth(startDate, endDate);

      if (alongAMonth) {
        return 'خریدهای ' + getMonthTitle(startDate);
      } else {
        return 'خریدهای ' + getMonthTitle(startDate, true) + ' تا ' + getMonthTitle(endDate, true);
      }
    } else {
      return '';
    }
  });
  installmentsPreviewHint = computed<string>(() => {
    if (this.data()?.installmentPreviews && this.data()!.installmentPreviews!.length > 0) {
      const firstInstallmentEffectiveDate = [...this.data()!.installmentPreviews!].sort((a, b) => a.date - b.date)[0].date;
      return (
        'مبلغ مصرف‌شده به صورت زیر در تاریخ ' + getMonthTitle(firstInstallmentEffectiveDate, true) + ' به لیست اقساط شما اضافه می‌شود.'
      );
    }
    return '';
  });
  bottomSheetService = inject(NgxBottomSheetService);
  creditApiService = inject(CreditApiService);
  router = inject(Router);
  creditUrlService = inject(CreditUrlService);
  private eventService = inject(NgxEventTrackerService);

  constructor() {
    effect(
      () => {
        this.setInstallmentsScrollableHeight();
      },
      {
        allowSignalWrites: true,
      },
    );
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.gettingData.set(true);
    this.creditApiService.getEarlySettlementDetail(this.creditId()).subscribe((response) => {
      this.data.set(response);
      if (response.installmentPreviews) {
        this.formatInstallments(response.installmentPreviews);
      }
      this.gettingData.set(false);
    });
  }

  setInstallmentsScrollableHeight() {
    if (this.installmentsDetailIsOpen() && this.detailElement() && !this.heightSet()) {
      this.detailElementHeight.set(this.detailElement()?.nativeElement.offsetHeight);
      this.heightSet.set(true);
      this.installmentsDetailIsOpen.set(false);
    }
  }

  formatInstallments(installments: InstallmentPreview[]) {
    const formattedInstallments: InstallmentFormatted[] = installments.map((item) => {
      let amountTitle: string;
      if (item.feeAmount) {
        amountTitle = currencyFormat(item.amount - item.feeAmount) + ' ریال' + ' + ' + currencyFormat(item.feeAmount) + ' ریال کارمزد';
      } else {
        amountTitle = currencyFormat(item.amount) + ' ریال';
      }

      return {
        amountTitle,
        date: getMonthTitle(item.date, true),
        order: 'قسط ' + item.order,
      };
    });
    this.installmentsFormatted.set(formattedInstallments);
  }

  onSettle() {
    if (this.data()?.partialPaymentEnable) {
      this.changeAmount();
    } else {
      this.goToPayment(this.data()?.maxAmount!);
    }
  }

  changeAmount() {
    this.bottomSheetService.openBottomSheet(
      CreditEarlySettlementChangeAmountDialogComponent,
      {
        maxAmount: this.data()?.maxAmount,
        minAmount: this.data()?.minAmount,
        label: this.data()?.label,
        creditId: this.data()?.creditId,
        icon: this.data()?.icon,
        billingCycleStartDate: this.data()?.billingCycleStartDate,
        billingCycleEndDate: this.data()?.billingCycleEndDate,
        installmentPreviews: this.data()?.installmentPreviews,
        earlySettlementSideNotes: this.data()?.earlySettlementSideNotes,
      },
      {
        noPadding: true,
      },
    );

    const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      const result = this.bottomSheetService.outputData();
      if (result && result.amount) {
        this.goToPayment(result.amount);
      }
    });
  }

  goToPayment(amount: number): void {
    this.redirecting.set(true);
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/early-settlement/pay/${this.creditId()}/${amount}`)).then(() => {
      this.redirecting.set(false);
      this.eventService.sendEvent({
        eventName: 'EarlyPayment',
        eventData: {},
      });
    });
  }

  toggle() {
    this.installmentsDetailIsOpen.update((prev) => !prev);
  }

  goInstallmentsOverview() {
    this.router.navigate(['service/credit/installments-overview'], {
      queryParams: {
        serviceType: 'bnpl',
      },
    });
  }
}
