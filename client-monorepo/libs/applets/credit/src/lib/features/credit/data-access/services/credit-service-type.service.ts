import { Inject, Injectable } from '@angular/core';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../credit-environment.interface';

@Injectable({
  providedIn: 'root',
})
export class CreditServiceTypeService {
  creditEnv: string;
  private serviceType: 'credit' | 'bnpl' | '' = '';

  constructor(
    @Inject(CREDIT_ENVIRONMENT)
    private creditEnvironment: CreditEnvironmentInterface,
  ) {
    this.creditEnv = this.creditEnvironment.creditEnv;
  }

  isBnpl() {
    return this.serviceType === 'bnpl';
  }

  isCredit() {
    return this.serviceType === 'credit';
  }

  setServiceType(type: 'credit' | 'bnpl') {
    this.serviceType = type;
  }

  getServiceType() {
    return this.serviceType;
  }

  giveResultByType<T>(creditResult: T, bnplResult: T): T {
    return this.serviceType === 'credit' ? creditResult : bnplResult;
  }
}
