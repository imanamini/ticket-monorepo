import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlanGroup } from '../../../../ui/models/credit/credit-plan-group';
import { CalculationFilter } from '../../../../ui/models/credit/calculation-filter.model';
import { CalculationErrorType } from '../../../../ui/models/credit/calculation-error-type.model';
import { CreditApiService } from './credit-api.service';
import {
  CREDIT_CALCULATION_STEP_TYPE,
  CreditCalculationStep
} from '../../../../ui/models/credit/calculation-step.model';
import { UserType } from '../../../../website/pages/credit/c-credit-club/models/user-type-model';

@Injectable({
  providedIn: 'root',
})
export class CreditCalculatorService {
  steps: CreditCalculationStep[] = [
    { type: CREDIT_CALCULATION_STEP_TYPE.BASE },
    { type: CREDIT_CALCULATION_STEP_TYPE.COLLATERAL },
    { type: CREDIT_CALCULATION_STEP_TYPE.JOURNEY_TYPE },
  ];

  activeStepIndex = new BehaviorSubject<number>(0);

  allPlans: PlanGroup[] = [];

  filteredPlans: PlanGroup[] = [];

  filters: CalculationFilter;

  errorType = new BehaviorSubject<CalculationErrorType | null>(null);

  fundProviders = [
    {
      fundProviderCode: 7,
      fundProviderName: 'digipay',
      fundProviderNameFa: 'دیجی پی',
    },
    {
      fundProviderCode: 1,
      fundProviderName: 'mellat',
      fundProviderNameFa: 'بانک ملت',
    },
    {
      fundProviderCode: 13,
      fundProviderName: 'tejarat',
      fundProviderNameFa: 'بانک تجارت',
    },
  ];

  constructor(private creditApiService: CreditApiService) {}

  init(userType?: UserType): Promise<void> {
    this.clearService();
    return new Promise((resolve, reject) => {
      this.creditApiService.getPlanGroups(userType).subscribe(
        (response) => {
          if (!response.planGroupDetails || !response.planGroupDetails.length) {
            this.errorType.next('no-plan');
          }
          this.allPlans = response.planGroupDetails;
          this.filteredPlans = response.planGroupDetails;
          this.filters = {};
          resolve();
        },
        (error) => {
          reject(error);
        },
      );
    });
  }

  clearService(): void {
    this.activeStepIndex.next(0);
    this.allPlans = [];
    this.filteredPlans = [];
    this.filters = {};
  }

  setFilters(changedFilters: CalculationFilter): void {
    this.filters = Object.assign({}, this.filters, changedFilters);
    this.onChangeFilter();
  }

  onChangeFilter(): void {
    this.filteredPlans = this.allPlans.filter((item) => {
      let output = true;
      Object.keys(this.filters).map((filterName) => {
        if (this.getValueOfFilter(item, filterName as keyof CalculationFilter) !== this.filters[filterName]) {
          output = false;
        }
      });
      return output;
    });
  }

  getValueOfFilter(planGroup: PlanGroup, filterName: keyof CalculationFilter): string | number {
    switch (filterName) {
      case 'fundProviderCode':
        return planGroup.fundProvider.fundProviderCode;
      case 'collateralType':
        return planGroup.collateralDto.type;
      case 'calculationFlowType':
        return planGroup.planRegistrationFlowDto.type;
      default:
        return planGroup[filterName];
    }
  }

  unsetFilters(removedFilters: (keyof CalculationFilter)[]): void {
    if (!removedFilters || !removedFilters.length) {
      return;
    }
    removedFilters.forEach((item) => {
      if (this.filters[item]) {
        delete this.filters[item];
      }
    });
    this.onChangeFilter();
  }

  distinctFieldItems(fieldName: string, from: any[]): (string | number)[] {
    const options = {};
    from.forEach((item) => {
      options[item[fieldName]] = true;
    });
    return Object.keys(options);
  }

  getFundProviderNameByCode(fundProviderCode: number) {
    const certainProvider = this.fundProviders.find((fp) => fp.fundProviderCode == fundProviderCode);
    return certainProvider && certainProvider.fundProviderName ? certainProvider.fundProviderName : '';
  }
}
