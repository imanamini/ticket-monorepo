import { ChangeDetectionStrategy, Component, DestroyRef, Inject, inject, OnInit, signal } from '@angular/core';
import { CreditAppBarComponent } from '../components/credit-app-bar/credit-app-bar.component';
import { NgxTabComponent, NgxTabsComponent, tabState } from '@digipay/ngx-tabs';
import { InstallmentsOverviewBnplComponent } from './components/installments-overview-bnpl/installments-overview-bnpl.component';
import { InstallmentsOverviewCreditComponent } from './components/installments-overview-credit/installments-overview-credit.component';
import { InstallmentsOverviewApiService } from './services/installments-overview-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SERVICE_TYPE } from '../data-access/models/credit/service-type/service-type.model';
import { MessageService } from '../data-access/services/message.service';
import { GetInstallmentsOverviewResponse, ServiceTypeInstallment } from './data-access/get-installments-overview-response';
import { InstallmentsOverviewBnplInstallment, InstallmentsOverviewBnplList } from './data-access/installments-overview-bnpl';
import { ConfigPaymentFlow } from '../data-access/models/credit/installment/installment-pay-config.response';
import { InstallmentsOverviewCredit, InstallmentsOverviewCreditInstallment } from './data-access/installments-overview-credit';
import { getMonthTitle, getYear } from '../data-access/utils/date';
import { Observable } from 'rxjs';
import { CreditPageLoadingComponent } from '../components/credit-page-loading/credit-page-loading.component';
import {
  DefaultInstallmentReferer,
  InstallmentRefererShortKey,
  PillarInstallmentReferer,
} from '../data-access/models/credit/installment/installment-referer.model';
import { InstallmentsOverviewRefererService } from './services/installments-overview-referer.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CREDIT_ENVIRONMENT } from '../credit-environment.interface';
import { CreditBackHandlerInterface } from '../data-access/models/credit-back-handler';
import { InstallmentsOverviewSourceUrlService } from './services/installments-overview-source-url.service';
import { CallbackInstallmentsOverviewKey } from '../credit-payment-callback/components/credit-payment-callback-installments-overview/credit-payment-callback-installments-overview.component';

enum Tabs {
  Bnpl,
  Credit,
}

interface DueInstallmentsCount {
  bnplCount?: number;
  creditCount?: number;
}

type queryParamServiceType = 'bnpl' | 'credit';

@Component({
  selector: 'app-installments-overview',
  templateUrl: './installments-overview.component.html',
  styleUrl: './installments-overview.component.scss',
  host: { '[class.pb-82]': 'isPillar' },
  standalone: true,
  imports: [
    CreditAppBarComponent,
    NgxTabsComponent,
    NgxTabComponent,
    InstallmentsOverviewBnplComponent,
    InstallmentsOverviewCreditComponent,
    CreditPageLoadingComponent,
  ],
  providers: [InstallmentsOverviewApiService, InstallmentsOverviewRefererService, InstallmentsOverviewSourceUrlService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallmentsOverviewComponent implements OnInit {
  // Signals
  selectedTab = signal<Tabs>(Tabs.Bnpl);
  dueInstallmentsCount = signal<DueInstallmentsCount>({}); // Used in badge
  bnplInstallments = signal<InstallmentsOverviewBnplList | null>(null);
  bnplPaymentFlow = signal<ConfigPaymentFlow | null>(null);
  creditInstallments = signal<InstallmentsOverviewCredit[] | null>(null);
  notHaveActiveBnpl = signal(false);
  notHaveActiveCredit = signal(false);
  bnplMaxLimitAmount = signal<number | null>(null);
  loading = signal(true);

  // Services
  private apiService = inject(InstallmentsOverviewApiService);
  private refererService = inject(InstallmentsOverviewRefererService);
  private sourceUrlService = inject(InstallmentsOverviewSourceUrlService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  // Variables
  protected readonly tabs = Tabs;
  protected readonly isPillar = inject(CREDIT_ENVIRONMENT).creditEnv === 'pillar';

  constructor(
    @Inject('CREDIT_BACK_HANDLER')
    private backService: CreditBackHandlerInterface,
  ) {}

  ngOnInit() {
    this.checkReferer();
    this.checkSourceUrl();
    this.routeServiceTypeHandler();
  }

  private checkReferer() {
    if (this.isPillar) {
      this.refererService.setReferer(PillarInstallmentReferer);
    } else {
      const referer = this.route.snapshot.queryParamMap.get(InstallmentRefererShortKey); // Referer shows from which referer user came
      referer && this.refererService.setReferer(referer);
    }
  }

  private checkSourceUrl() {
    const sourceUrl = this.route.snapshot.queryParamMap.get(CallbackInstallmentsOverviewKey); // To go here after receipt
    sourceUrl && this.sourceUrlService.setSourceUrl(sourceUrl);
  }

  routeServiceTypeHandler() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((queryParams) => {
      const serviceType = queryParams['serviceType'] as queryParamServiceType;
      if (serviceType) {
        if (serviceType === 'bnpl') {
          this.selectedTab.set(Tabs.Bnpl);
          this.setBnplData();
          return;
        }
        if (serviceType === 'credit') {
          this.selectedTab.set(Tabs.Credit);
          this.setCreditData();
          return;
        }
      } else {
        this.router.navigate([], {
          queryParams: {
            serviceType: 'bnpl',
          },
          replaceUrl: true,
          queryParamsHandling: 'merge',
          state: window.history.state,
        });
      }
    });
  }

  setBnplData() {
    if (!this.bnplInstallments()) {
      this.loading.set(true);
      this.apiService.getInstallmentsOverview(SERVICE_TYPE.BNPL, this.refererService.referer() || DefaultInstallmentReferer).subscribe({
        next: (response) => {
          this.setDueInstallmentsCount(response.userInstallmentSummary.serviceTypeInstallments);
          this.serializeBnplData(response);
        },
        error: (e) => {
          this.loading.set(false);
          this.messageService.showErrorOfErrorResponse(e);
          setTimeout(() => {
            window.history.back();
          }, 3000);
        },
      });
    }
  }

  serializeBnplData(response: GetInstallmentsOverviewResponse) {
    this.setBnplPaymentFlow(response);
    this.setBnplMaxLimitAmount(response);
    this.checkIfHasActiveBnpl(response).subscribe({
      next: (_) => {
        const categorizedInstallments: InstallmentsOverviewBnplList = [];
        let hasDueInstallment = false;
        response.installmentDebt.forEach((contract) => {
          const contractTrackingCode = contract.contractTrackingCode;
          const creditId = contract.creditId;
          const contractTotalInstallmentsCount = contract.count;
          contract.installments.forEach((installment) => {
            if (installment.isDue) {
              hasDueInstallment = true;
            }
            const newInstallmentObject: InstallmentsOverviewBnplInstallment = {
              checked: signal(installment.isDue),
              contractTrackingCode,
              creditId,
              contractTotalInstallmentsCount,
              amount: installment.amount,
              order: installment.order,
              isDue: installment.isDue,
              penalty: installment.penalty,
              penaltyWaiverAmount: installment.penaltyWaiverAmount,
              fee: installment.fee,
              title:
                contractTotalInstallmentsCount === 1 ? 'بدهی ماهانه' : 'قسط ' + installment.order + ' از ' + contractTotalInstallmentsCount,
            };
            if (contract.billingCycleInfo && contract.billingCycleInfo.merchantsBusinessIds) {
              newInstallmentObject.billingCycleInfo = {
                startDate: contract.billingCycleInfo.startDate,
                endDate: contract.billingCycleInfo.endDate,
              };
              if (contract.billingCycleInfo.merchantsBusinessIds) {
                newInstallmentObject.merchantBusinessIds = [...new Set(contract.billingCycleInfo.merchantsBusinessIds)];
              }
            }
            const existDueIndex = categorizedInstallments.findIndex(
              (categorizedInstallment) => categorizedInstallment.dueDate === installment.dueDate,
            );
            if (existDueIndex > -1) {
              categorizedInstallments[existDueIndex].installments.push(newInstallmentObject);
              categorizedInstallments[existDueIndex].installments.sort(
                (a, b) => a.contractTotalInstallmentsCount - b.contractTotalInstallmentsCount,
              );
            } else {
              categorizedInstallments.push({
                dueDate: installment.dueDate,
                installments: [newInstallmentObject],
              });
            }
          });
        });
        categorizedInstallments.sort((a, b) => a.dueDate - b.dueDate);
        if (!hasDueInstallment && categorizedInstallments[0]) {
          categorizedInstallments[0].installments[0].checked = signal(true);
        }
        this.bnplInstallments.set(categorizedInstallments);
        this.loading.set(false);
      },
    });
  }

  private setBnplPaymentFlow(response: GetInstallmentsOverviewResponse) {
    if (response.installmentDebt && response.installmentDebt[0]) {
      this.bnplPaymentFlow.set(response.installmentDebt[0].fundProvider.paymentFlow);
    }
  }

  private setBnplMaxLimitAmount(response: GetInstallmentsOverviewResponse) {
    if (response.installmentDebt && response.installmentDebt[0]) {
      this.bnplMaxLimitAmount.set(response.installmentDebt[0].maxLimitAmount);
    }
  }

  private checkIfHasActiveBnpl(response: GetInstallmentsOverviewResponse) {
    return new Observable((observer) => {
      if (!response.installmentDebt || response.installmentDebt.length === 0) {
        this.apiService.hasActiveBnpl().subscribe({
          next: (has) => {
            if (!has) {
              this.notHaveActiveBnpl.set(true);
            }
            observer.next(null);
          },
          error: (e) => {
            this.loading.set(false);
            this.messageService.showErrorOfErrorResponse(e);
            setTimeout(() => {
              window.history.back();
            }, 3000);
          },
        });
      } else {
        observer.next(null);
      }
    });
  }

  setCreditData() {
    if (!this.creditInstallments()) {
      this.loading.set(true);
      this.apiService.getInstallmentsOverview(SERVICE_TYPE.CREDIT, this.refererService.referer() || DefaultInstallmentReferer).subscribe({
        next: (response) => {
          this.setDueInstallmentsCount(response.userInstallmentSummary.serviceTypeInstallments);
          this.serializeCreditData(response);
        },
        error: (e) => {
          this.loading.set(false);
          this.messageService.showErrorOfErrorResponse(e);
          setTimeout(() => {
            window.history.back();
          }, 3000);
        },
      });
    }
  }

  serializeCreditData(response: GetInstallmentsOverviewResponse) {
    this.checkIfHasActiveCredit(response).subscribe({
      next: (_) => {
        const allCreditInstallments = response.installmentDebt.map<InstallmentsOverviewCredit>((contract) => {
          const maxPayableInstallmentOrder = this.getMaxPayableInstallmentOrder(
            contract.count,
            contract.installments.length,
            contract.payableInstallmentsLimit,
          );
          const installments = contract.installments
            .sort((a, b) => a.order - b.order)
            .map<InstallmentsOverviewCreditInstallment>((installment, index) => {
              const deActive = installment.order > maxPayableInstallmentOrder;
              return {
                checked: signal(!deActive && (index === 0 || installment.isDue)),
                deActive,
                order: installment.order,
                isDue: installment.isDue,
                amount: installment.amount,
                penalty: installment.penalty,
                penaltyWaiverAmount: installment.penaltyWaiverAmount,
                fee: installment.fee,
                title: 'قسط ' + installment.order + ' از ' + contract.count,
                subtitle:
                  'وام ' +
                  contract.fundProvider.name +
                  ' - ' +
                  getMonthTitle(installment.dueDate, true) +
                  ' ' +
                  getYear(installment.dueDate),
              };
            });
          return {
            contractTrackingCode: contract.contractTrackingCode,
            clearAmount: contract.clearAmount,
            discountAmount: contract.discountAmount ?? 0,
            contractTotalInstallmentsCount: contract.count,
            fundProvider: {
              businessId: contract.fundProvider.businessId,
              englishName: contract.fundProvider.englishName,
              name: contract.fundProvider.name,
            },
            paymentFlow: contract.fundProvider.paymentFlow,
            maxLimitAmount: contract.maxLimitAmount,
            maxPayableInstallmentOrder: maxPayableInstallmentOrder,
            installments,
          };
        });
        this.creditInstallments.set(allCreditInstallments);
        this.loading.set(false);
      },
    });
  }

  private getMaxPayableInstallmentOrder(totalCount: number, unpaidCount: number, payableInstallmentsLimit?: number) {
    if (Number.isInteger(payableInstallmentsLimit)) {
      return totalCount - unpaidCount + payableInstallmentsLimit!;
    } else {
      return totalCount;
    }
  }

  private checkIfHasActiveCredit(response: GetInstallmentsOverviewResponse) {
    return new Observable((observer) => {
      if (!response.installmentDebt || response.installmentDebt.length === 0) {
        this.apiService.hasActiveCredit().subscribe({
          next: (has) => {
            if (!has) {
              this.notHaveActiveCredit.set(true);
            }
            observer.next(null);
          },
          error: (e) => {
            this.loading.set(false);
            this.messageService.showErrorOfErrorResponse(e);
            setTimeout(() => {
              window.history.back();
            }, 3000);
          },
        });
      } else {
        observer.next(null);
      }
    });
  }

  setDueInstallmentsCount(serviceTypeInstallments: ServiceTypeInstallment[]) {
    if (Object.keys(!this.dueInstallmentsCount()).length < 1) {
      const bnplCount = serviceTypeInstallments.find((item) => item.serviceType === SERVICE_TYPE.BNPL)!.dueInstallmentCount;
      const creditCount = serviceTypeInstallments.find((item) => item.serviceType === SERVICE_TYPE.CREDIT)!.dueInstallmentCount;
      this.dueInstallmentsCount.set({
        // zero number is considered
        bnplCount: bnplCount ? bnplCount : undefined,
        creditCount: creditCount ? creditCount : undefined,
      });
    }
  }

  back() {
    this.backService.goBack();
  }

  tabChangeHandler($event: tabState, tab: Tabs) {
    $event === 'selected' &&
      this.router.navigate([], {
        queryParams: {
          serviceType: tab === Tabs.Bnpl ? 'bnpl' : 'credit',
        },
        replaceUrl: true,
        queryParamsHandling: 'merge',
        state: window.history.state,
      });
  }
}
