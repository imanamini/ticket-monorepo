import { Component, inject, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ContractInstallmentSummaryListResponse } from '../data-access/models/credit/installment/contract-installment-summary-list.response';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../data-access/utils/url';
import { Subscription } from 'rxjs';
import { CreditApiService } from '../data-access/services/credit-api.service';
import { CreditRouteStateInterface } from '../data-access/services/route-state/credit-route-state.interface';
import { ContractInstallmentSummary } from '../data-access/models/credit/installment/contract-installment-summary';
import { CONTRACT_DEBT_STATUS } from '../data-access/models/credit/installment/contract-debt-status';
import {
  AggregationPayableInstallments,
  CreditAggregationInstallmentsComponent,
} from './credit-aggregation-installments/credit-aggregation-installments.component';
import { FUND_PROVIDER_CODE } from '../data-access/models/credit/fund-provider/fund-provider-code';
import { SERVICE_TYPE } from '../data-access/models/credit/service-type/service-type.model';
import { BNPL_TYPE } from '../data-access/models/credit/installment/bnpl-type';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditPageLoadingComponent } from '../components/credit-page-loading/credit-page-loading.component';
import { CreditAggregationBottomComponent } from './credit-aggregation-bottom/credit-aggregation-bottom.component';
import { CreditWalletDetailMultiContractComponent } from './credit-wallet-detail-multi-contract/credit-wallet-detail-multi-contract.component';
import { CreditWalletDetailSingleContractComponent } from './credit-wallet-detail-single-contract/credit-wallet-detail-single-contract.component';
import { CreditEarlySettlementComponent } from './credit-early-settlement/credit-early-settlement.component';
import { CreditCalloutMessageComponent } from '../components/credit-wallet-detail-header-message/credit-callout-message.component';
import { CreditWalletDetailFullMessageComponent } from './credit-wallet-detail-full-message/credit-wallet-detail-full-message.component';
import { CreditScrollableViewComponent } from '../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditWalletDetailHeaderComponent } from '../components/credit-wallet-detail-header/credit-wallet-detail-header.component';
import { CreditInstallmentFeeService } from '../data-access/services/credit-installment-fee.service';
import { CreditBackHandlerInterface } from '../data-access/models/credit-back-handler';

@Component({
  selector: 'app-credit-wallet-detail',
  templateUrl: './credit-wallet-detail.component.html',
  styleUrls: ['./credit-wallet-detail.component.scss'],
  standalone: true,
  imports: [
    CreditWalletDetailHeaderComponent,
    CreditScrollableViewComponent,
    CreditWalletDetailFullMessageComponent,
    CreditCalloutMessageComponent,
    CreditEarlySettlementComponent,
    CreditWalletDetailSingleContractComponent,
    CreditWalletDetailMultiContractComponent,
    CreditAggregationBottomComponent,
    CreditPageLoadingComponent,
  ],
})
export class CreditWalletDetailComponent implements OnInit, OnDestroy {
  creditId = signal<string | null>(null);
  gettingData = signal<boolean | null>(null);
  data = signal<ContractInstallmentSummaryListResponse | null>(null);
  collapseHeader = signal<boolean | null>(null);
  fundProviderColor = signal<string | null>(null);
  subscriptions: Subscription[] = [];
  fundProviderCode = signal<number | null>(null);
  showEarlySettlement = signal<boolean | null>(null);
  aggregationEnabled = signal<boolean | null>(null);
  aggregationTotalAmount = signal<number | null>(0);
  serviceType!: SERVICE_TYPE;
  showAgreements = signal<boolean | null>(null); // show agreements in header menu
  bnplType = signal<BNPL_TYPE | null>(null);
  private aggregationPayableInstallments: AggregationPayableInstallments[] = [];

  bottomSheetService = inject(NgxBottomSheetService);
  private installmentFeeService = inject(CreditInstallmentFeeService);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private creditUrlService: CreditUrlService,
    private creditApiService: CreditApiService,
    @Inject('RouteStateInterface')
    private routeStateService: CreditRouteStateInterface,
    @Inject('CREDIT_BACK_HANDLER')
    private backHandlerService: CreditBackHandlerInterface,
  ) {}

  ngOnInit(): void {
    if (typeof this.activatedRoute.snapshot.params['creditId'] === 'undefined') {
      const routeState = this.routeStateService.getAll();
      if (
        routeState &&
        routeState.homeAction &&
        routeState.homeAction.payload &&
        typeof routeState.homeAction.payload.fundProviderCode !== 'undefined' &&
        typeof routeState.homeAction.payload.creditId !== 'undefined'
      ) {
        const creditId = routeState.homeAction.payload.creditId;
        const destinationUrl = this.creditUrlService.getInnerServicePath(`/wallet/detail/${creditId}`);
        if (routeState.homeAction.payload.shouldAcceptTac) {
          this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/wallet/tac'), {
            state: {
              destination: destinationUrl,
            },
          });
          return;
        }
        this.router.navigateByUrl(destinationUrl);
        return;
      }
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
      return;
    }
    this.creditId.set(this.activatedRoute.snapshot.params['creditId']);

    if (
      this.activatedRoute.snapshot.queryParams['showAgreements'] &&
      this.activatedRoute.snapshot.queryParams['showAgreements'] === 'true'
    ) {
      this.showAgreements.set(true);
    }
    this.getData();
  }

  getData(): void {
    this.gettingData.set(true);
    const gettingDataSubscription = this.creditApiService.getWalletInstallments(this.creditId()!).subscribe({
      next: (response) => {
        this.data.set(response);
        if (this.data()?.header.installmentCount === 3) {
          this.bnplType.set(BNPL_TYPE.BNPL4PAY);
        } else if (this.data()?.header.installmentCount === 1) {
          this.bnplType.set(BNPL_TYPE.BNPL1PAY);
        }
        this.showEarlySettlement.set(response.header.serviceType === SERVICE_TYPE.BNPL);
        this.fundProviderColor.set(response.header.color);
        this.fundProviderCode.set(response.header.fundProviderCode);
        this.serviceType = response.header.serviceType;
        this.installmentFeeService.setFeeDetails(response.header.fee);
        this.makeAggregation(response.contracts);
        this.gettingData.set(false);
      },
      error: (error) => {
        this.gettingData.set(false);
        console.error('Error loading wallet installments:', error);
        // Navigate back or show error message
        this.backHandlerService.goBack();
      },
    });
    this.subscriptions.push(gettingDataSubscription);
  }

  onHeaderCloseClick(): void {
    this.backHandlerService.goBack();
  }

  onScroll(event: any): void {
    const st = event.target.scrollTop;
    if (st === 0 && this.collapseHeader()) {
      this.collapseHeader.set(false);
    }
    if (st >= 150 && !this.collapseHeader()) {
      this.collapseHeader.set(true);
    }
  }

  onAggregationClick() {
    this.bottomSheetService.openBottomSheet(
      CreditAggregationInstallmentsComponent,
      {
        contracts: this.aggregationPayableInstallments,
        fundProviderCode: this.fundProviderCode(),
        totalInstallmentCount: this.data()?.header.installmentCount,
        maxLimitAmount: this.data()?.maxLimitAmount,
      },
      {
        noPadding: true,
      },
    );

    const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      const result = this.bottomSheetService.outputData();
      if (result) {
        this.router
          .navigateByUrl(this.creditUrlService.getInnerServicePath(`/installment/pay/${this.creditId()}?options=${result}`))
          .then();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach((s) => {
        if (s) {
          s.unsubscribe();
        }
      });
    }
  }

  private makeAggregation(contracts: ContractInstallmentSummary[]): void {
    let installmentsCount = 0;
    for (const contract of contracts) {
      if (contract.status !== CONTRACT_DEBT_STATUS.DUE) {
        continue;
      }

      const aggregationPayableInstallmentsItem: AggregationPayableInstallments = { trackingCode: contract.contractTrackingCode };
      for (const installmentGroup of contract.installmentGroups) {
        if (!installmentGroup.payable) {
          continue;
        }

        installmentsCount += installmentGroup.installments!.length;
        this.aggregationTotalAmount.update(
          (amount) => amount! + installmentGroup.installments!.reduce((prev, cur) => prev + cur.totalAmount, 0),
        );
        aggregationPayableInstallmentsItem.installments = installmentGroup.installments;
      }
      this.aggregationPayableInstallments.push(aggregationPayableInstallmentsItem);
    }

    this.aggregationEnabled.set(installmentsCount > 1 && this.data()?.header.fundProviderCode === FUND_PROVIDER_CODE.DIGIPAY);
  }
}
