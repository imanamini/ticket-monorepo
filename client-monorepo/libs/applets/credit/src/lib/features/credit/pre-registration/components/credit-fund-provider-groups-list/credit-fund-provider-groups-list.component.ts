import { ChangeDetectionStrategy, Component, effect, input, OnInit, output, signal, untracked } from '@angular/core';
import { PlanGroup, USER_ENTRY_POINT } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { CreditFundProviderGroupCardModel } from '../credit-fund-provider-groups-card/credit-fund-provider-group-card.model';
import { CreditSelectFundProviderEventModel } from '../../pre-registration-steps/pre-registration-step-base/credit-select-fund-provider-event.model';
import { CreditFundProviderGroupsCardComponent } from '../credit-fund-provider-groups-card/credit-fund-provider-groups-card.component';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxIcon } from '@digipay/ngx-icon';
import { CreditFundProviderGroupsCardSkeletonComponent } from '../credit-fund-provider-groups-card-skeleton/credit-fund-provider-groups-card-skeleton.component';

@Component({
  selector: 'app-credit-fund-provider-groups-list',
  templateUrl: './credit-fund-provider-groups-list.component.html',
  styleUrls: ['./credit-fund-provider-groups-list.component.scss'],
  imports: [CreditFundProviderGroupsCardComponent, NgxTrackableIdDirective, NgxIcon, CreditFundProviderGroupsCardSkeletonComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditFundProviderGroupsListComponent implements OnInit {
  planGroups = input<PlanGroup[]>();
  groupCards = signal<CreditFundProviderGroupCardModel[] | null>(null);

  selectFundProvider = output<CreditSelectFundProviderEventModel>();

  constructor() {
    effect(() => {
      const planGroups = this.planGroups();
      if (planGroups) {
        untracked(() => {
          this.initData();
        });
      }
    });
  }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    const dataGroupByFp: { [key: string]: CreditFundProviderGroupCardModel } = {};
    if (!this.planGroups()) {
      return;
    }
    this.planGroups()?.forEach((item) => {
      const uniqueName = [item.fundProvider.fundProviderCode, item.allocationPrepaymentAmount, item.userEntryPoint].join('_');
      if (!dataGroupByFp[uniqueName]) {
        dataGroupByFp[uniqueName] = {
          fundProviderCode: item.fundProvider.fundProviderCode,
          fundProviderName: item.fundProvider.name,
          fundProviderIcon: item.fundProvider.icon,
          fundProviderColor: item.fundProvider.color,
          allocationPrepaymentAmount: item.allocationPrepaymentAmount,
          allocationPrepaymentPercentage: item.allocationPrepaymentPercentage!,
          interestPercentage: item.interestPercentage,
          installmentAmount: item.installmentAmount,
          creditAmount: item.creditAmount,
          collateralAmount: item.collateralAmount,
          installmentCount: item.installmentCount,
          serviceType: item.serviceType,
          sumInstallmentAmount: item.sumInstallmentAmount!,
          payableAmount: item.payableAmount,
          collaterals: [{ name: item.collateralDto.name, type: item.collateralDto.type }],
          hasAllocationPrepayment: item.hasAllocationPrepayment,
          priority: item.priority!,
          subscriptionDetail: item.subscriptionDetail,
          paymentMethod: item.paymentMethod,
          planRuleType: item.planRuleType,
          balance: item.balance,
          userEntryPoint: item.userEntryPoint,
        };
      } else {
        dataGroupByFp[uniqueName].collaterals.push({
          name: item.collateralDto.name,
          type: item.collateralDto.type,
        });
        if (!dataGroupByFp[uniqueName].priority || dataGroupByFp[uniqueName].priority > item.priority!) {
          dataGroupByFp[uniqueName].priority = item.priority!;
        }
      }
    });
    // sort by priority, payable amount and collaterals by precedence
    this.groupCards.set(
      Object.values(dataGroupByFp).sort((a, b) => {
        if (a.priority === undefined) {
          if (b.priority === undefined) {
            if (a.payableAmount === b.payableAmount) {
              return a.collaterals.join(' یا ').localeCompare(b.collaterals.join(' یا '));
            } else {
              return a.payableAmount - b.payableAmount;
            }
          } else {
            return 1;
          }
        } else {
          if (b.priority === undefined) {
            return -1;
          } else {
            return a.priority - b.priority;
          }
        }
      }),
    );
  }

  onSelectFundProvider(event: CreditSelectFundProviderEventModel, item: CreditFundProviderGroupCardModel) {
    // DON'T delete this comment because when any event tracker runs, we need these lines

    // const plan = {
    //   fundProvider: item.fundProviderName,
    //   creditAmount: item.creditAmount,
    //   collateralAmount: item.collateralAmount,
    //   collateralType: item.collaterals[0].name,
    //   installmentAmount: item.installmentAmount,
    //   installmentCount: item.installmentCount,
    //   interestPercentage: item.interestPercentage,
    //   payableAmount: item.payableAmount,
    //   serviceType: SERVICE_TYPE_TRANSLATION[item.serviceType],
    //   allocationPrePaymentAmount: item.allocationPrepaymentAmount,
    //   sumInstallmentAmount: item.sumInstallmentAmount,
    //   paymentMethod: PAYMENT_METHOD_TRANSLATION[item.paymentMethod!],
    //   subscriptionDetailType: item.subscriptionDetail?.type,
    //   subscriptionDetailAmount: item.subscriptionDetail?.amount,
    //   subscriptionDetailTitle: item.subscriptionDetail?.title,
    //   subscriptionDetailDurationInMonth: item.subscriptionDetail?.durationInMonth,
    //   creditId: '',
    //   province: '',
    //   city: '',
    // };
    // this.intrackService.plan.next(plan);
    // this.eventService.sendEvent({
    //   eventName: 'SelectPlan',
    //   eventData: plan,
    // });
    this.selectFundProvider.emit(event);
  }

  protected readonly USER_ENTRY_POINT = USER_ENTRY_POINT;
}
