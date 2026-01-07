import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PlanGroup } from '../../../../models/credit/credit-plan-group';
import { CreditFundProviderGroupCardModel } from '../../../../models/credit/credit-fund-provider-group-card.model';
import { CreditSelectFundProviderEventModel } from '../../../../models/credit/credit-select-fund-provider-event.model';
import { ActivatedRoute } from '@angular/router';
import { CreditFundProviderGroupsCardComponent } from '../credit-fund-provider-groups-card/credit-fund-provider-groups-card.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-credit-fund-provider-groups-list',
  templateUrl: './credit-fund-provider-groups-list.component.html',
  styleUrls: ['./credit-fund-provider-groups-list.component.scss'],
  standalone: true,
  imports: [NgFor, CreditFundProviderGroupsCardComponent],
})
export class CreditFundProviderGroupsListComponent implements OnInit, OnChanges {
  @Input() planGroups: PlanGroup[];

  @Input() nobitexMode = false;

  @Input() certainPlan: boolean;

  @Input() certainFundProviderCode = null;

  @Input() showFundProviderIcon = true;

  @Input() isDetailPageCtaDisplayed = true;

  @Input() showInterestPercentage = true;

  @Output() selectFundProvider = new EventEmitter<CreditSelectFundProviderEventModel>();
  @Output() selectCollateral = new EventEmitter<string>();

  groupCards: CreditFundProviderGroupCardModel[];

  collateral: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.collateral) {
        this.collateral = params.collateral;
      }
      this.initData();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planGroups) {
      this.initData();
    }
  }

  initData(): void {
    const dataGroupByFp: { [key: string]: CreditFundProviderGroupCardModel } = {};

    if (!this.planGroups) {
      return;
    }
    this.planGroups.forEach((item) => {
      if (!dataGroupByFp[item.fundProvider.fundProviderCode + '_' + item.allocationPrepaymentAmount]) {
        dataGroupByFp[item.fundProvider.fundProviderCode + '_' + item.allocationPrepaymentAmount] = {
          installmentCount: item.installmentCount,
          sumInstallmentAmount: item.sumInstallmentAmount,
          fundProviderCode: item.fundProvider.fundProviderCode,
          fundProviderName: item.fundProvider.name,
          fundProviderIcon: item.fundProvider.icon,
          fundProviderColor: item.fundProvider.color,
          allocationPrepaymentAmount: item.allocationPrepaymentAmount,
          allocationPrepaymentPercentage: item.allocationPrepaymentPercentage,
          interestPercentage: item.interestPercentage,
          installmentAmount: item.installmentAmount,
          payableAmount: item.payableAmount,
          collaterals: [{ name: item.collateralDto.name, type: item.collateralDto.type }],
          hasAllocationPrepayment: item.hasAllocationPrepayment,
          priority: item.priority,
          creditAmount: item.creditAmount,
          paymentMethod: item.paymentMethod,
          subscriptionDetail: item.subscriptionDetail,
          planRuleType: item.planRuleType,
          balance: item.balance,
        };
      } else {
        dataGroupByFp[item.fundProvider.fundProviderCode + '_' + item.allocationPrepaymentAmount].collaterals.push({
          name: item.collateralDto.name,
          type: item.collateralDto.type,
        });
      }
    });
    this.groupCards = this.sortBasedOnAllocationPrepayment(Object.values(dataGroupByFp));
    if (this.collateral) {
      this.groupCards = this.groupCards.filter((card) => card.collaterals[0].type === this.collateral);
    }
  }

  sortBasedOnAllocationPrepayment(fundProviders: CreditFundProviderGroupCardModel[]): CreditFundProviderGroupCardModel[] {
    return fundProviders.sort((a, b) => {
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
    });
  }

  onSelectFundProvider(event: CreditSelectFundProviderEventModel) {
    this.selectFundProvider.emit(event);
  }

  passCollateral(collateral: string) {
    this.selectCollateral.emit(collateral);
  }
}
