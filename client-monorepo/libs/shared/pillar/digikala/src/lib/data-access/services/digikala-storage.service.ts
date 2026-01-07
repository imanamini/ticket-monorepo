import { inject, Injectable } from '@angular/core';
import { DigikalaService } from './digikala.service';
import { Platform } from '../models/digikala-hybrid-js-function.interface';
import {
  BeforeLoginRouteModel,
  ForgetPasswordSchemaModel,
  InputUtmData,
  IStorageService,
  StorageService,
  SubscriptionSchemaModel,
} from '@client-monorepo/common/utilities';
import { AuthResponse } from '@client-monorepo/common/user';
import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';
import { Coordination } from '@client-monorepo/common/location-management';

@Injectable({
  providedIn: 'root',
})
export class DigikalaStorageService implements IStorageService {
  private storageService = inject(StorageService);
  private digikalaService = inject(DigikalaService);

  private getPlatform(): Platform | 'web' {
    try {
      if (!this.digikalaService.isDigikalaSuperApp) return 'web';
      return this.digikalaService.getPlatform();
    } catch {
      return 'web';
    }
  }
  private get isAndroid(): boolean {
    return this.getPlatform() === 'android';
  }
  private get isWeb(): boolean {
    return this.getPlatform() === 'web';
  }

  private runVoid(webImpl: () => void): void {
    const p = this.getPlatform();
    if (p === 'web') return webImpl();
    if (p === 'android' || p === 'ios') {
      webImpl();
      void this.persistLocalStorage();
      return;
    }
  }
  private runValue<T>(webImpl: () => T, iosDefault: T): T {
    const p = this.getPlatform();
    if (p === 'web') return webImpl();
    if (p === 'android' || p === 'ios') {
      const res = webImpl();
      void this.persistLocalStorage();
      return res;
    }
    return iosDefault; // ios
  }

  // Persist/restore for Android only
  private dumpLocalStorage(): Record<string, string> {
    const dump: Record<string, string> = {};
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key != null) dump[key] = window.localStorage.getItem(key) ?? '';
      }
    } catch {
      this.safeLog('dumpLocalStorage error');
    }
    return dump;
  }
  private async persistLocalStorage(): Promise<void> {
    if (!this.isAndroid) return;
    try {
      const dump = this.dumpLocalStorage();
      const dumpStr = JSON.stringify(dump);
      this.digikalaService.persistLocalStorage(dumpStr);
    } catch (e) {
      this.safeLog('persistLocalStorage error: ' + (e as Error)?.message);
    }
  }

  // IStorageService implementation (web => delegate, android => delegate+persist, ios => defaults/no-ops)
  getUserId(): string {
    return this.runValue(() => this.storageService.getUserId(), '');
  }
  setUserData(data: { userId: string; phoneNumber: string }): void {
    this.runVoid(() => this.storageService.setUserData(data));
  }
  getUserData(): any {
    return this.runValue(() => this.storageService.getUserData(), '');
  }
  getRefreshToken(): string | null {
    return this.runValue(() => this.storageService.getRefreshToken(), null);
  }
  getToken(): string | null {
    return this.runValue(() => this.storageService.getToken(), null);
  }
  isLoggedIn(): boolean {
    return this.runValue(() => this.storageService.isLoggedIn(), false);
  }
  isTokenExpired(): boolean {
    return this.runValue(() => this.storageService.isTokenExpired(), false);
  }
  storeBeforeLoginRoute(route: BeforeLoginRouteModel): void {
    this.runVoid(() => this.storageService.storeBeforeLoginRoute(route));
  }
  getBeforeLoginRoute(): BeforeLoginRouteModel | null {
    return this.runValue(() => this.storageService.getBeforeLoginRoute(), null);
  }
  storeOnBoardingChecked(): void {
    this.runVoid(() => this.storageService.storeOnBoardingChecked());
  }
  isOnboardingChecked(): boolean {
    return this.runValue(() => this.storageService.isOnboardingChecked(), false);
  }
  setWalkThroughSate(rootElementId: string, step: string): void {
    this.runVoid(() => this.storageService.setWalkThroughSate(rootElementId, step));
  }
  getWalkThroughSate(rootElementId: string): string | null {
    return this.runValue(() => this.storageService.getWalkThroughSate(rootElementId), null);
  }
  updateAuth(response: AuthResponse): void {
    this.runVoid(() => this.storageService.updateAuth(response));
  }
  expireToken(): void {
    this.runVoid(() => this.storageService.expireToken());
  }
  setCardHistory(srcCardIndex: number | string, data: any): void {
    this.runVoid(() => this.storageService.setCardHistory(srcCardIndex, data));
  }
  getCardHistory(): any {
    return this.runValue(() => this.storageService.getCardHistory(), null);
  }
  removeCardHistory(cardIndex: PropertyKey): void {
    this.runVoid(() => this.storageService.removeCardHistory(cardIndex));
  }
  getSubscriptionStorage(): SubscriptionSchemaModel {
    return this.runValue(() => this.storageService.getSubscriptionStorage(), {} as SubscriptionSchemaModel);
  }
  setSubscriptionStorage(subscriptionParams: SubscriptionSchemaModel): void {
    this.runVoid(() => this.storageService.setSubscriptionStorage(subscriptionParams));
  }
  removeSubscriptionStorage(): void {
    this.runVoid(() => this.storageService.removeSubscriptionStorage());
  }
  getForgetPasswordStorage(): ForgetPasswordSchemaModel {
    return this.runValue(() => this.storageService.getForgetPasswordStorage(), {} as ForgetPasswordSchemaModel);
  }
  setForgetPasswordStorage(forgetPasswordParams: ForgetPasswordSchemaModel): void {
    this.runVoid(() => this.storageService.setForgetPasswordStorage(forgetPasswordParams));
  }
  removeForgetPasswordStorage(): void {
    this.runVoid(() => this.storageService.removeForgetPasswordStorage());
  }
  getRedirectUrlAfterLogin(): string | null {
    return this.runValue(() => this.storageService.getRedirectUrlAfterLogin(), null);
  }
  removeRedirectUrlAfterLogin(): void {
    this.runVoid(() => this.storageService.removeRedirectUrlAfterLogin());
  }
  setPassword(): void {
    this.runVoid(() => this.storageService.setPassword());
  }
  isSetPassword(): boolean {
    return this.runValue(() => this.storageService.isSetPassword(), false);
  }
  removePasswordData(): void {
    this.runVoid(() => this.storageService.removePasswordData());
  }
  getCallbackUrl(): string | null {
    return this.runValue(() => this.storageService.getCallbackUrl(), null);
  }
  saveCallbackUrl(value: string): void {
    this.runVoid(() => this.storageService.saveCallbackUrl(value));
  }
  setTicketData(ticket: string, data: any): void {
    this.runVoid(() => this.storageService.setTicketData(ticket, data));
  }
  getTicketData(): any {
    return this.runValue(() => this.storageService.getTicketData(), null);
  }
  removeTicketData(ticket: PropertyKey): void {
    this.runVoid(() => this.storageService.removeTicketData(ticket));
  }
  addResolveUrl(url: string): void {
    this.runVoid(() => this.storageService.addResolveUrl(url));
  }
  setHasBiometric(): void {
    this.runVoid(() => this.storageService.setHasBiometric());
  }
  hasBiometric(): boolean {
    return this.runValue(() => this.storageService.hasBiometric(), false);
  }
  removeHasBiometric(): void {
    this.runVoid(() => this.storageService.removeHasBiometric());
  }
  getSearchHistory(): Array<string> {
    return this.runValue(() => this.storageService.getSearchHistory(), []);
  }
  setSearchHistory(history: Array<string>): void {
    this.runVoid(() => this.storageService.setSearchHistory(history));
  }
  getHubSearchHistory(): Array<FrequentServicesIdEnum> {
    return this.runValue(() => this.storageService.getHubSearchHistory(), []);
  }
  setHubSearchHistory(history: Array<FrequentServicesIdEnum>): void {
    this.runVoid(() => this.storageService.setHubSearchHistory(history));
  }
  removeHubSearchHistory(): void {
    this.runVoid(() => this.storageService.removeHubSearchHistory());
  }
  setTimeStamp(time: number): void {
    this.runVoid(() => this.storageService.setTimeStamp(time));
  }
  getTimeStamp(): string | null {
    return this.runValue(() => this.storageService.getTimeStamp(), null);
  }
  removeTimeStamp(): void {
    this.runVoid(() => this.storageService.removeTimeStamp());
  }
  setRedirectionTimestamp(time: number): void {
    this.runVoid(() => this.storageService.setRedirectionTimestamp(time));
  }
  getRedirectionTimestamp(): string | null {
    return this.runValue(() => this.storageService.getRedirectionTimestamp(), null);
  }
  removeRedirectionTimestamp(): void {
    this.runVoid(() => this.storageService.removeRedirectionTimestamp());
  }
  getLocationTimeStamp(): number | null {
    return this.runValue(() => this.storageService.getLocationTimeStamp(), null);
  }
  setLocationTimeStamp(timestamp: number): void {
    this.runVoid(() => this.storageService.setLocationTimeStamp(timestamp));
  }
  removeLocationTimeStamp(): void {
    this.runVoid(() => this.storageService.removeLocationTimeStamp());
  }
  getNativeUpdateTimeStamp(): number | null {
    return this.runValue(() => this.storageService.getNativeUpdateTimeStamp(), null);
  }
  setNativeUpdateTimeStamp(timestamp: number): void {
    this.runVoid(() => this.storageService.setNativeUpdateTimeStamp(timestamp));
  }
  removeNativeUpdateTimeStamp(): void {
    this.runVoid(() => this.storageService.removeNativeUpdateTimeStamp());
  }
  setHasLocation(): void {
    this.runVoid(() => this.storageService.setHasLocation());
  }
  hasSetLocation(): boolean {
    return this.runValue(() => this.storageService.hasSetLocation(), false);
  }
  removeSetLocation(): void {
    this.runVoid(() => this.storageService.removeSetLocation());
  }
  getLastLocation(): Coordination | undefined {
    return this.runValue(() => this.storageService.getLastLocation(), undefined);
  }
  setLastLocation(location: Coordination): void {
    this.runVoid(() => this.storageService.setLastLocation(location));
  }
  removeLastLocation(): void {
    this.runVoid(() => this.storageService.removeLastLocation());
  }
  getLocationEventTimeStamp(): number | null {
    return this.runValue(() => this.storageService.getLocationEventTimeStamp(), null);
  }
  setLocationEventTimeStamp(timestamp: number): void {
    this.runVoid(() => this.storageService.setLocationEventTimeStamp(timestamp));
  }
  removeLocationEventTimeStamp(): void {
    this.runVoid(() => this.storageService.removeLocationEventTimeStamp());
  }
  setInputUtmData(utmData: InputUtmData): void {
    this.runVoid(() => this.storageService.setInputUtmData(utmData));
  }
  getInputUtmData(): null | InputUtmData {
    return this.runValue(() => this.storageService.getInputUtmData(), null);
  }
  getSessionId(): string {
    return this.runValue(() => this.storageService.getSessionId(), '');
  }
  setCheckHubOnboarding(): void {
    this.runVoid(() => this.storageService.setCheckHubOnboarding());
  }
  hasCheckHubOnboarding(): boolean {
    return this.runValue(() => this.storageService.hasCheckHubOnboarding(), false);
  }
  toggleAssetHide(key: string): boolean {
    return this.runValue(() => this.storageService.toggleAssetHide(key), false);
  }
  getAssetsHideStatus(): any {
    return this.runValue(() => this.storageService.getAssetsHideStatus(), false as any);
  }
  resetAssetHideStatus(): void {
    this.runVoid(() => this.storageService.resetAssetHideStatus());
  }
  setMessageApiCall(): void {
    this.runVoid(() => this.storageService.setMessageApiCall());
  }
  isMessageApiCall(): boolean {
    return this.runValue(() => this.storageService.isMessageApiCall(), false);
  }
  getAppMessageTimeStamp(): number | null {
    return this.runValue(() => this.storageService.getAppMessageTimeStamp(), null);
  }
  setAppMessageTimeStamp(timestamp: number): void {
    this.runVoid(() => this.storageService.setAppMessageTimeStamp(timestamp));
  }
  removeAppMessageTimeStamp(): void {
    this.runVoid(() => this.storageService.removeAppMessageTimeStamp());
  }
  storeDigipayCardOnboardingChecked(): void {
    this.runVoid(() => this.storageService.storeDigipayCardOnboardingChecked());
  }

  isDigipayCardOnboardingChecked(): boolean {
    return this.runValue(() => this.storageService.isDigipayCardOnboardingChecked(), false);
  }

  get web(): StorageService {
    return this.storageService;
  }

  private safeLog(msg: string): void {
    if (this.digikalaService?.logger) this.digikalaService.logger(`[DigikalaStorageService] ${msg}`);
    else console.debug('[DigikalaStorageService]', msg);
  }
}
