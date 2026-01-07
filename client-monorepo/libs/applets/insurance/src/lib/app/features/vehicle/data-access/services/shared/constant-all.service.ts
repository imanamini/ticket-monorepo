import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { InsuranceCompanyModel } from '../../models/third-party/available-products/insurance-company.model';
import { getDefaultItemId } from '../../../util/default-value.util';
import { CarDataModel } from '../../models/third-party/constant-all/car-data.model';
import { ConstantAllModel } from '../../models/third-party/constant-all/constant-all.model';
import { ConstantsApiService } from './constants-api.service';
import { CarUsageModel } from '../../models/third-party/constant-all/car-usage.model';

@Injectable({
  providedIn: 'root'
})

export class ConstantAllService {
  private apiService = inject(ConstantsApiService);

  private constantAll: BehaviorSubject<ConstantAllModel> = new BehaviorSubject<ConstantAllModel>(null);
  private carTypes: BehaviorSubject<CarDataModel[]> = new BehaviorSubject<CarDataModel[]>([]);
  private motorTypes: BehaviorSubject<CarDataModel[]> = new BehaviorSubject<CarDataModel[]>([]);
  private carUsages: BehaviorSubject<CarUsageModel[]> = new BehaviorSubject<CarUsageModel[]>([]);
  private insuranceCompanies: BehaviorSubject<Partial<InsuranceCompanyModel>[]> = new BehaviorSubject<Partial<InsuranceCompanyModel>[]>([]);
  private healthDamages: BehaviorSubject<CarDataModel[]> = new BehaviorSubject<CarDataModel[]>([]);
  private propertyDamages: BehaviorSubject<CarDataModel[]> = new BehaviorSubject<CarDataModel[]>([]);
  private driverDamages: BehaviorSubject<CarDataModel[]> = new BehaviorSubject<CarDataModel[]>([]);
  private driverDiscounts: BehaviorSubject<CarDataModel[]> = new BehaviorSubject<CarDataModel[]>([]);
  private thirdPartyDiscounts: BehaviorSubject<CarDataModel[]> = new BehaviorSubject<CarDataModel[]>([]);
  private coverageRates: BehaviorSubject<CarDataModel[]> = new BehaviorSubject<CarDataModel[]>([]);
  private durations: BehaviorSubject<CarDataModel[]> = new BehaviorSubject<CarDataModel[]>([]);

  public driverDiscountDefaultValue = signal<number>(null);
  public thirdPartyDiscountDefaultValue = signal<number>(null);
  public driverDamageDefaultValue = signal<number>(null);
  public propertyDamageDefaultValue = signal<number>(null);
  public healthDamageDefaultValue = signal<number>(null);

  getConstantsVariables(): Observable<void> {
    return this.apiService.getConstantAll()
      .pipe(map((res) => {
        const constantAll = res.result;
        this.constantAll.next(constantAll);
        this.carTypes.next(constantAll.carTypes);
        this.motorTypes.next(constantAll.motorTypes);
        this.carUsages.next(constantAll.carUsages);
        this.insuranceCompanies.next(constantAll.insuranceCompanies);
        this.healthDamages.next(constantAll.healthDamages);
        this.propertyDamages.next(constantAll.propertyDamages);
        this.driverDamages.next(constantAll.driverDamages);
        this.driverDiscounts.next(constantAll.driverDiscounts);
        this.thirdPartyDiscounts.next(constantAll.thirdPartyDiscounts);
        this.coverageRates.next(constantAll.coverageRates);
        this.durations.next(constantAll.durations);

        this.driverDiscountDefaultValue.set(getDefaultItemId(constantAll.driverDiscounts));
        this.thirdPartyDiscountDefaultValue.set(getDefaultItemId(constantAll.thirdPartyDiscounts));
        this.driverDamageDefaultValue.set(getDefaultItemId(constantAll.driverDamages));
        this.healthDamageDefaultValue.set(getDefaultItemId(constantAll.healthDamages));
        this.propertyDamageDefaultValue.set(getDefaultItemId(constantAll.propertyDamages));
      }), catchError(err => throwError(err)));
  }

  getConstantAll(): Observable<ConstantAllModel> {
    return this.constantAll.asObservable();
  }

  getCarTypes(): Observable<CarDataModel[]> {
    return this.carTypes.asObservable();
  }

  getMotorTypes(): Observable<CarDataModel[]> {
    return this.motorTypes.asObservable();
  }

  getCarUsages(): Observable<CarUsageModel[]> {
    return this.carUsages.asObservable();
  }

  getInsuranceCompanies(): Observable<Partial<InsuranceCompanyModel>[]> {
    return this.insuranceCompanies.asObservable();
  }

  getHealthDamages(): Observable<CarDataModel[]> {
    return this.healthDamages.asObservable();
  }

  getPropertyDamages(): Observable<CarDataModel[]> {
    return this.propertyDamages.asObservable();
  }

  getDriverDamages(): Observable<CarDataModel[]> {
    return this.driverDamages.asObservable();
  }

  getDriverDiscounts(): Observable<CarDataModel[]> {
    return this.driverDiscounts.asObservable();
  }

  getThirdPartyDiscounts(): Observable<CarDataModel[]> {
    return this.thirdPartyDiscounts.asObservable();
  }

  getCoverageRates(): Observable<CarDataModel[]> {
    return this.coverageRates.asObservable();
  }

  getDurations(): Observable<CarDataModel[]> {
    return this.durations.asObservable();
  }
}
