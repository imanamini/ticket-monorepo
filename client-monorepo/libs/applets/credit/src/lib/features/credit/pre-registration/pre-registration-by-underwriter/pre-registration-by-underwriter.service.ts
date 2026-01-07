import { Injectable } from '@angular/core';
import { PlanGroup } from '../../data-access/models/credit/pre-registration/credit-plan-group';
import { isIranPlans } from './pre-regitration-by-underwriter.data';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InquiryUnderwriterRequest } from '../../data-access/models/credit/underwriter/inquiry-underwriter.request';

@Injectable({
  providedIn: 'root',
})
export class PreRegistrationByUnderwriterService {
  constructor(private creditApiService: CreditApiService) {}

  distinctFieldItems(fieldName: string, from: any[]): (string | number)[] {
    const options: any = {};
    from.forEach((item) => {
      options[item[fieldName]] = true;
    });
    return Object.keys(options);
  }

  getPlans(requestData: InquiryUnderwriterRequest): Observable<PlanGroup[]> {
    return this.creditApiService.inquiryUnderwriter(requestData).pipe(
      map((response) => {
        return isIranPlans.filter((plan) => {
          return (
            plan.creditAmount <= response.maxCreditAmount &&
            plan.maxInstallmentAmount! <= response.maxInstallmentAmount &&
            plan.installmentCount <= response.maxInstallmentCount
          );
        });
      }),
    );
  }
}
