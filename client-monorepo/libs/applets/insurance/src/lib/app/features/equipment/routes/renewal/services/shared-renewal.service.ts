import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UsedHeaderButtonModes } from '../../used/partials/used-header/models/used-header-button.modes';
import { UsedHeaderDataModel } from '../../used/partials/used-header/models/used-header-data.model';
import { JourneyNamesModel } from '../../../shared-steps/models/journey-names.model';
import { LoggedInUser } from '../../../../../data-access/models/logged-in-user.model';
import { OrderModel } from '../../../api/models/renewal/order.model';
import { ProductCategoryModel } from '../../../api/models/policy/product-category.model';
import { StateModel } from '../../../api/models/renewal/state.model';

@Injectable({
  providedIn: 'root'
})
export class SharedRenewalService {
  constructor() {
  }

  // Subjects
  public usedOnBoardingKey = 'UsedOnBoardingIsMet';
  private stepChangeSubject = new Subject<'NEXT' | 'PREVIOUS'>();
  private headerBackClick = new Subject<boolean>();
  private activeIndexBehaviorSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private uniqueCodeBehaviorSubject = new BehaviorSubject<string>(null);
  private providerIdBehaviorSubject = new BehaviorSubject<string>(null);
  private showHealthCheckSubject = new Subject<boolean>();
  private journeyBehaviorSubject: BehaviorSubject<JourneyNamesModel> = new BehaviorSubject<JourneyNamesModel>(JourneyNamesModel.RENEWAL);
  private selectedCategoryBehaviorSubject = new BehaviorSubject<ProductCategoryModel>(null);
  private journey = this.journeyBehaviorSubject.getValue();
  private stateDataBehaviorSubject = new BehaviorSubject<StateModel[]>(null);
  private userInfoBehaviorSubject = new BehaviorSubject<LoggedInUser>(null);
  private headerButtonClickedSubject = new Subject<UsedHeaderButtonModes>();
  private headerDataSubject = new BehaviorSubject<UsedHeaderDataModel>(null);
  private orderInfoBehaviorSubject = new BehaviorSubject<OrderModel>(null);
  private showHeaderBehaviorSubject = new BehaviorSubject<boolean>(true);
  private isUserFromNativeAppBehaviorSubject = new BehaviorSubject<boolean>(false);
  private isUserFromWebAppBehaviorSubject = new BehaviorSubject<boolean>(false);
  // Only for use in native app mode
  private jwtTokenBehaviorSubject = new BehaviorSubject<string>(null);

  getJwtTokenValue(): string {
    return this.jwtTokenBehaviorSubject.getValue();
  }

  setJwtToken(val: string): void {
    this.jwtTokenBehaviorSubject.next(val);
  }

  getStateData(): Observable<StateModel[]> {
    return this.stateDataBehaviorSubject.asObservable();
  }

  setStateData(data: StateModel[]): void {
    this.stateDataBehaviorSubject.next(data);
  }

  getBackClick(): Observable<boolean> {
    return this.headerBackClick.asObservable();
  }

  setBackClick(): void {
    this.headerBackClick.next(null);
  }

  getActiveIndex(): Observable<number> {
    return this.activeIndexBehaviorSubject.asObservable();
  }

  setActiveIndex(value: number): void {
    this.activeIndexBehaviorSubject.next(value);
  }

  setJourney(value: JourneyNamesModel): void {
    this.journeyBehaviorSubject.next(value);
    this.journey = this.journeyBehaviorSubject.getValue();
  }

  getSelectedCategoryValue(): ProductCategoryModel {
    return this.selectedCategoryBehaviorSubject.getValue();
  }

  setSelectedCategory(value: ProductCategoryModel): void {
    this.selectedCategoryBehaviorSubject.next(value);
  }

  setShowHealthCheckSubject(value: boolean): void {
    this.showHealthCheckSubject.next(value);
  }

  getShowHealthCheckSubject(): Observable<boolean> {
    return this.showHealthCheckSubject.asObservable();
  }

  setStepChangeSubject(value: 'NEXT' | 'PREVIOUS'): void {
    this.stepChangeSubject.next(value);
  }

  getStepChangeSubject(): Observable<'NEXT' | 'PREVIOUS'> {
    return this.stepChangeSubject.asObservable();
  }

  setUniqueCode(value: string): void {
    this.uniqueCodeBehaviorSubject.next(value);
  }

  getUniqueCode(): Observable<string> {
    return this.uniqueCodeBehaviorSubject.asObservable();
  }

  getUniqueCodeValue(): string {
    return this.uniqueCodeBehaviorSubject.getValue();
  }

  setUserInfo(info: LoggedInUser): void {
    this.userInfoBehaviorSubject.next(info);
  }

  getUserInfo(): Observable<LoggedInUser> {
    return this.userInfoBehaviorSubject.asObservable();
  }

  getUserInfoValue(): LoggedInUser {
    return this.userInfoBehaviorSubject.value;
  }

  saveUniqueCodeInLS(value: string): void {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      if (localStorage.getItem('renewalUniqueCode')) {
        localStorage.removeItem('renewalUniqueCode');
      }
      localStorage.setItem('renewalUniqueCode', value);
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      if (localStorage.getItem('UsedUniqueCode')) {
        localStorage.removeItem('UsedUniqueCode');
      }
      localStorage.setItem('UsedUniqueCode', value);
    }

  }

  getUniqueCodeFromLS(): string {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      return localStorage.getItem('renewalUniqueCode');
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      return localStorage.getItem('UsedUniqueCode');
    }
  }

  removeUniqueCodeFromLS(): void {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      localStorage.removeItem('renewalUniqueCode');
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      localStorage.removeItem('UsedUniqueCode');
    }
  }

  setProviderId(value: string): void {
    this.providerIdBehaviorSubject.next(value);
  }

  getProviderId(): Observable<string> {
    return this.providerIdBehaviorSubject.asObservable();
  }

  setHeaderButtonClicked(value: UsedHeaderButtonModes): void {
    this.headerButtonClickedSubject.next(value);
  }

  getHeaderButtonClicked(): Observable<UsedHeaderButtonModes> {
    return this.headerButtonClickedSubject.asObservable();
  }

  setHeaderData(value: UsedHeaderDataModel): void {
    this.headerDataSubject.next(value);
  }

  getHeaderData(): Observable<UsedHeaderDataModel> {
    return this.headerDataSubject.asObservable();
  }

  setOrderInfo(value: OrderModel): void {
    this.orderInfoBehaviorSubject.next(value);
  }

  getOrderInfo(): Observable<OrderModel> {
    return this.orderInfoBehaviorSubject.asObservable();
  }

  setShowHeader(value: boolean): void {
    this.showHeaderBehaviorSubject.next(value);
  }

  getShowHeaderValue(): boolean {
    return this.showHeaderBehaviorSubject.getValue();
  }

  setIsUserFromNativeApp(value: boolean): void {
    this.isUserFromNativeAppBehaviorSubject.next(value);
  }

  getIsUserFromNativeAppValue(): boolean {
    return this.isUserFromNativeAppBehaviorSubject.getValue();
  }

  setIsUserFromWebApp(value: boolean): void {
    this.isUserFromWebAppBehaviorSubject.next(value);
  }

  getIsUserFromWebAppValue(): boolean {
    return this.isUserFromWebAppBehaviorSubject.getValue();
  }
}
