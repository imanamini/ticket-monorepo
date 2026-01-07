import {computed, Injectable, signal} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {PlanGroup} from '../../../../ui/models/credit/credit-plan-group';
import {CalculationErrorType} from '../../../../ui/models/credit/calculation-error-type.model';
import {CreditApiService} from './credit-api.service';
import {UserType} from '../../../../website/pages/credit/c-credit-club/models/user-type-model';

@Injectable({
  providedIn: 'root',
})
export class CreditCalculatorV2Service {

  initialized = signal(false);
  allPlans = signal<PlanGroup[]>([]);

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

  constructor(private creditApiService: CreditApiService) {
  }

  init(userType?: UserType): Promise<void> {
    if (this.initialized()) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.creditApiService.getPlanGroups(userType).subscribe({
        next: (response) => {
          if (!response.planGroupDetails || !response.planGroupDetails.length) {
            this.errorType.next('no-plan');
          }
          const serviceTypeToRemove = 0; //remove bnpl plans
          const filteredServices = response.planGroupDetails.filter((service) => service.serviceType !== serviceTypeToRemove);
          this.allPlans.set(filteredServices || []);
          this.initialized.set(true);
          resolve();
        },
        error: (err) => reject(err),
      })
    });
  }

  maxAmountAndInstallments = computed(()=>{
    const all = this.allPlans();
    if (!all.length) return null;
    const maxAmount = Math.max(...all.map(p => +p.creditAmount));

    const maxIC = Math.max(...all
      .filter(p => +p.creditAmount === maxAmount)
      .map(p => +p.installmentCount));
    return {amount: maxAmount, installmentCount: maxIC};
  })

  distinctFieldItems(fieldName
                     :
                     string, from
                     :
                     any[]
  ):
    (string | number)[] {
    const options = {};
    from.forEach((item) => {
      options[item[fieldName]] = true;
    });
    return Object.keys(options);
  }

  getFundProviderNameByCode(fundProviderCode
                            :
                            number
  ) {
    const certainProvider = this.fundProviders.find((fp) => fp.fundProviderCode == fundProviderCode);
    return certainProvider && certainProvider.fundProviderName ? certainProvider.fundProviderName : '';
  }
}
