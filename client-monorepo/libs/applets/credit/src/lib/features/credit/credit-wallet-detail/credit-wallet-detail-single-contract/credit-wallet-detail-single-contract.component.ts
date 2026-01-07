import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { ContractInstallmentGroup } from '../../data-access/models/credit/installment/contract-installment-group';
import { ContractInstallmentSummary } from '../../data-access/models/credit/installment/contract-installment-summary';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { AggregationInstallmentFields, Installment } from '../../data-access/models/credit/installment/installment';
import { CreditPreSettleInstallmentsComponent } from '../credit-pre-settle-installments/credit-pre-settle-installments.component';
import { CreditConfirmDialogComponent } from '../../components/credit-confirm-dialog/credit-confirm-dialog.component';
import { CreditConfirmDialogData } from '../../components/credit-confirm-dialog/models/credit-confirm-dialog-data';
import { CreditInstallmentPaymentService } from '../../data-access/services/credit-installment-payment.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { CreditInstallmentItemComponent } from '../credit-installment-item/credit-installment-item.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { InstallmentGroupOrder } from '../../data-access/models/installment.model';
import { SERVICE_TYPE } from '../../data-access/models/credit/service-type/service-type.model';
import {
  InstallmentsOverviewBnplHistoryStateKey,
  InstallmentsOverviewBnplInitSelected,
} from '../../installments-overview/data-access/installments-overview-bnpl';
import { CallbackInstallmentsOverviewKey } from '../../credit-payment-callback/components/credit-payment-callback-installments-overview/credit-payment-callback-installments-overview.component';

@Component({
  selector: 'app-credit-wallet-detail-single-contract',
  templateUrl: './credit-wallet-detail-single-contract.component.html',
  styleUrls: ['./credit-wallet-detail-single-contract.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, CreditInstallmentItemComponent, NgxCalloutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditWalletDetailSingleContractComponent implements OnInit {
  contract = input<ContractInstallmentSummary>();
  creditId = input.required<string>();
  fundProviderCode = input.required<number>();
  totalInstallmentCount = input<number>();
  maxPaymentAmount = input<number>();
  serviceType = input.required<SERVICE_TYPE>();
  installmentGroups = computed<ContractInstallmentGroup[]>(() => this.contract()?.installmentGroups.sort((a, b) => a.order - b.order)!);
  futureUnpaidInstallmentsCount = computed<number>(
    () => this.installmentGroups().find((group) => group.order === InstallmentGroupOrder.Unpaid)?.installments?.length ?? 0,
  );

  protected readonly ServiceType = SERVICE_TYPE;

  private payableInstallment!: Installment;

  isSingleInstallment = computed(() => {
    let totalInstallmentOfContract = 0;
    this.installmentGroups().forEach((groupItem) => {
      groupItem.installments?.forEach((item) => {
        if (item.payable) {
          this.payableInstallment = item;
        }
      });
      totalInstallmentOfContract += groupItem.installments && groupItem.installments.length ? groupItem.installments.length : 0;
    });
    return totalInstallmentOfContract === 1;
  });

  bottomSheetService = inject(NgxBottomSheetService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  creditUrlService = inject(CreditUrlService);
  private eventService = inject(NgxEventTrackerService);
  installmentPaymentService = inject(CreditInstallmentPaymentService);

  ngOnInit(): void {
    this.openPreSettleFromUrl();
  }

  onPay() {
    // const options: AggregationInstallmentFields[] = [
    //   {
    //     trackingCode: this.contract()?.contractTrackingCode!,
    //     count: 1,
    //     amount: this.payableInstallment.totalAmount,
    //   },
    // ];
    // if (options[0].amount > (this.maxPaymentAmount() ?? 0)) {
    //   return this.installmentPaymentService.outOfRangeAmountHandler();
    // }
    // this.sendToPay(options);
    if (this.serviceType() === SERVICE_TYPE.BNPL) {
      this.router.navigate(['service/credit/installments-overview'], {
        queryParams: {
          serviceType: 'bnpl',
        },
        state: {
          [InstallmentsOverviewBnplHistoryStateKey]: {
            type: 'ContractFirstInstallment',
            contractTrackingCode: this.contract()?.contractTrackingCode,
          } as InstallmentsOverviewBnplInitSelected,
        },
      });
    }
  }

  onPreSettle() {
    this.eventService.sendEvent({
      eventName: 'BNPL_BD',
      eventData: {},
    });
    const remainedGroup: ContractInstallmentGroup = this.installmentGroups().filter(
      (group) => group.installments?.length! > 0 && !group.installments?.some((installment) => installment.trackingCode),
    )?.[0];

    const options: AggregationInstallmentFields[] = [
      {
        trackingCode: this.contract()?.contractTrackingCode!,
        count: 1,
        amount: remainedGroup?.installments![0].totalAmount ?? 0, // probably amount is not required
      },
    ];

    if (options[0].amount > (this.maxPaymentAmount() ?? 0)) {
      return this.installmentPaymentService.outOfRangeAmountHandler();
    }

    this.sendToPay(options);
  }

  openPreSettleFromUrl() {
    if (this.activatedRoute.snapshot.queryParams['showPreSettle'] === 'true' && this.contract()?.clearAmount) {
      this.openPreSettle();
    }
  }

  openPreSettle() {
    const data = this.contract();
    this.bottomSheetService.openBottomSheet(
      CreditPreSettleInstallmentsComponent,
      {
        contractInstallmentSummary: { ...data },
        maxPaymentAmount: this.maxPaymentAmount(),
      },
      {
        noPadding: true,
      },
    );

    const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      const result = this.bottomSheetService.outputData();
      if (result) {
        if (result.options.needConfirm) {
          const confirmData: CreditConfirmDialogData = {
            title: 'آیا از تسویه کل بدهی اطمینان دارید؟',
            description: 'در صورت پرداخت، تمامی اقساط باقی‌مانده شما تسویه می‌شود',
            confirmButtonTitle: 'تایید و ادامه',
            rejectButtonTitle: 'انصراف',
          };
          this.bottomSheetService.openBottomSheet(CreditConfirmDialogComponent, {
            title: confirmData.title,
            description: confirmData.description,
            confirmButtonTitle: confirmData.confirmButtonTitle,
            rejectButtonTitle: confirmData.rejectButtonTitle,
          });

          const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
            bottomSheetService.unsubscribe();
            const confirmResult = this.bottomSheetService.outputData();
            if (confirmResult) {
              this.sendToPay(result.data);
            }
          });
          return;
        }
        this.sendToPay(result.data);
      }
    });
  }

  goToInstallmentOverview() {
    this.router.navigate(['service/credit/installments-overview'], {
      queryParams: {
        serviceType: 'credit',
        [CallbackInstallmentsOverviewKey]: encodeURIComponent(window.location.pathname + window.location.search),
      },
    });
  }

  sendToPay(options: AggregationInstallmentFields[]) {
    const optionsStringified = JSON.stringify(options);
    this.router
      .navigateByUrl(this.creditUrlService.getInnerServicePath(`/installment/pay/${this.creditId()}?options=${optionsStringified}`))
      .then();
  }
}
