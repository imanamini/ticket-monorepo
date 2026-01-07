import { Injectable } from '@angular/core';
import { AuthenticationStorageInterface, AuthResponse } from '@client-monorepo/common/user';
import { BeforeLoginRouteModel } from '../models/before-login-route.model';
import { SubscriptionSchemaModel } from '../models/subscription-schema.model';
import { ForgetPasswordSchemaModel } from '../models/forget-password-schema.model';
import { Coordination } from '@client-monorepo/common/location-management';
import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';
import { InputUtmData } from '../models/input-utm-data';
import { IStorageService } from '../models/storage-service.interface';
import { STORAGE_KEY } from '../constants/storage-key.const';

@Injectable({
  providedIn: 'root',
})
export class StorageService implements IStorageService {
  getUserId(): string {
    const dps = localStorage.getItem(STORAGE_KEY.DB_STORAGE);
    if (dps && dps !== 'undefined' && dps !== 'null') {
      try {
        const dpsJson = JSON.parse(dps);
        if (dpsJson?.auth?.userId) {
          return dpsJson.auth.userId;
        }
      } catch (e) {
        console.error('Failed to parse DB_STORAGE:', e);
      }
    }

    const dpUserId = localStorage.getItem(STORAGE_KEY.USER_ID_STORAGE_KEY);
    if (dpUserId && dpUserId !== 'undefined') {
      try {
        return JSON.parse(dpUserId);
      } catch (e) {
        console.error('Failed to parse USER_ID_STORAGE_KEY:', e);
        // If it's already a plain string userId, return it directly
        return dpUserId;
      }
    }

    return '';
  }

  setUserData(data: { userId: string; phoneNumber: string }) {
    const dps = localStorage.getItem(STORAGE_KEY.DB_STORAGE);
    if (dps) {
      const dpsJson = JSON.parse(dps);
      dpsJson.auth = {
        ...data,
      };
      localStorage.setItem(STORAGE_KEY.DB_STORAGE, JSON.stringify(dpsJson));
      localStorage.setItem(STORAGE_KEY.USER_ID_STORAGE_KEY, JSON.stringify(dpsJson?.auth?.userId));
    } else {
      const newDps = {
        auth: {
          ...data,
        },
      };
      localStorage.setItem(STORAGE_KEY.USER_ID_STORAGE_KEY, JSON.stringify(newDps?.auth?.userId));
      localStorage.setItem(STORAGE_KEY.DB_STORAGE, JSON.stringify(newDps));
    }
  }

  getUserData() {
    const dps = localStorage.getItem(STORAGE_KEY.DB_STORAGE);
    if (dps) {
      const dpsJson = JSON.parse(dps);
      return dpsJson.auth;
    }
    return '';
  }

  public getRefreshToken(): string | null {
    const auth: string | null = localStorage.getItem(STORAGE_KEY.DB_STORAGE);
    const authObject: AuthenticationStorageInterface | null = auth ? JSON.parse(auth) : null;
    return authObject?.auth?.refresh || null;
  }

  public getToken(): string | null {
    const auth: string | null = localStorage.getItem(STORAGE_KEY.DB_STORAGE);
    const authObject: AuthenticationStorageInterface | null = auth ? JSON.parse(auth) : null;
    return authObject?.auth?.access || null;
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public isTokenExpired(): boolean {
    return this.getToken() === STORAGE_KEY.EXPIRED_TOKEN_VALUE;
  }

  public storeBeforeLoginRoute(route: BeforeLoginRouteModel): void {
    sessionStorage.setItem(STORAGE_KEY.DP_BEFORE_LOGIN_ROUTE, JSON.stringify(route));
  }

  public getBeforeLoginRoute(): BeforeLoginRouteModel | null {
    return sessionStorage.getItem(STORAGE_KEY.DP_BEFORE_LOGIN_ROUTE)
      ? JSON.parse(sessionStorage.getItem(STORAGE_KEY.DP_BEFORE_LOGIN_ROUTE)!)
      : null;
  }

  public storeOnBoardingChecked(): void {
    localStorage.setItem(STORAGE_KEY.DP_ONBOARDING_CHECKED, 'true');
  }

  public isOnboardingChecked(): boolean {
    return localStorage.getItem(STORAGE_KEY.DP_ONBOARDING_CHECKED) === 'true';
  }

  setWalkThroughSate(rootElementId: string, step: string): void {
    const item = localStorage.getItem(rootElementId);
    if (item) {
      const itemJson = JSON.parse(item);
      itemJson.step = step;
      localStorage.setItem(rootElementId, JSON.stringify(itemJson));
    } else {
      const newItem = { step };
      localStorage.setItem(rootElementId, JSON.stringify(newItem));
    }
  }

  getWalkThroughSate(rootElementId: string): string | null {
    const item = localStorage.getItem(rootElementId);
    if (item) {
      return JSON.parse(item).step;
    } else {
      return null;
    }
  }

  public updateAuth(response: AuthResponse): void {
    const auth = localStorage.getItem(STORAGE_KEY.DB_STORAGE);
    const authObject = auth
      ? JSON.parse(auth)
      : {
          auth: {},
        };
    authObject.auth.access = response.accessToken;
    authObject.auth.refresh = response.refreshToken;
    authObject.auth.userId = response.userId || authObject.auth.userId;
    const dpUserId = localStorage.getItem(STORAGE_KEY.USER_ID_STORAGE_KEY);
    if (!dpUserId) {
      localStorage.setItem(STORAGE_KEY.USER_ID_STORAGE_KEY, JSON.stringify(authObject.auth?.userId));
    }
    localStorage.setItem(STORAGE_KEY.DB_STORAGE, JSON.stringify(authObject));
  }

  /**
   * Forcefully expires the current access token.
   *
   * This is useful in scenarios such as:
   * - Requiring re-authentication after app resume
   * - Forcing PIN entry or other login flows
   */
  public expireToken(): void {
    const auth = localStorage.getItem(STORAGE_KEY.DB_STORAGE);
    const authObject = auth
      ? JSON.parse(auth)
      : {
          auth: {},
        };
    authObject.auth.access = STORAGE_KEY.EXPIRED_TOKEN_VALUE;
    localStorage.setItem(STORAGE_KEY.DB_STORAGE, JSON.stringify(authObject));
  }

  public setCardHistory(srcCardIndex: number | string, data: any): void {
    const storage = localStorage.getItem(STORAGE_KEY.DB_STORAGE);
    let storageObject = storage ? JSON.parse(storage) : null;
    storageObject = {
      ...storageObject,
      cardHistory: {
        ...storageObject.cardHistory,
        [srcCardIndex]: data,
      },
    };
    localStorage.setItem(STORAGE_KEY.DB_STORAGE, JSON.stringify(storageObject));
  }

  public getCardHistory() {
    const storage = localStorage.getItem(STORAGE_KEY.DB_STORAGE);
    const storageObject = storage ? JSON.parse(storage) : null;
    return storageObject?.cardHistory || null;
  }

  public removeCardHistory(cardIndex: PropertyKey): void {
    const storage = localStorage.getItem(STORAGE_KEY.DB_STORAGE);
    let storageObject = storage ? JSON.parse(storage) : null;
    const data = storageObject?.cardHistory;
    delete data[cardIndex];
    storageObject = { ...storageObject, cardHistory: { ...data } };
    localStorage.setItem(STORAGE_KEY.DB_STORAGE, JSON.stringify(storageObject));
  }

  public getSubscriptionStorage(): SubscriptionSchemaModel {
    const getSubscriptionStorage = localStorage.getItem(STORAGE_KEY.SUBSCRIPTION_STORAGE);
    if (getSubscriptionStorage) {
      const subscriptionStorage = JSON.parse(getSubscriptionStorage);
      if (+subscriptionStorage?.callbackExpTime < +Date.now()) {
        localStorage.removeItem(STORAGE_KEY.SUBSCRIPTION_STORAGE);
        sessionStorage.removeItem('serviceType');
        return {};
      }
      return subscriptionStorage;
    }
    return {};
  }

  public setSubscriptionStorage(subscriptionParams: SubscriptionSchemaModel): void {
    localStorage.setItem(STORAGE_KEY.SUBSCRIPTION_STORAGE, JSON.stringify({ ...this.getSubscriptionStorage(), ...subscriptionParams }));
  }

  public removeSubscriptionStorage(): void {
    const getSubscriptionStorage = localStorage.getItem(STORAGE_KEY.SUBSCRIPTION_STORAGE);
    if (getSubscriptionStorage) {
      localStorage.removeItem(STORAGE_KEY.SUBSCRIPTION_STORAGE);
    }
    sessionStorage.removeItem('serviceType');
  }

  public getForgetPasswordStorage(): ForgetPasswordSchemaModel {
    const getStorage = localStorage.getItem(STORAGE_KEY.FORGET_PASSWORD_STORAGE);
    if (getStorage) {
      return JSON.parse(getStorage);
    }
    return {};
  }

  public setForgetPasswordStorage(forgetPasswordParams: ForgetPasswordSchemaModel): void {
    localStorage.setItem(
      STORAGE_KEY.FORGET_PASSWORD_STORAGE,
      JSON.stringify({ ...this.getForgetPasswordStorage(), ...forgetPasswordParams }),
    );
  }

  public removeForgetPasswordStorage(): void {
    const getStorage = localStorage.getItem(STORAGE_KEY.FORGET_PASSWORD_STORAGE);
    if (getStorage) {
      localStorage.removeItem(STORAGE_KEY.FORGET_PASSWORD_STORAGE);
    }
  }

  public getRedirectUrlAfterLogin(): string | null {
    return sessionStorage.getItem(STORAGE_KEY.REDIRECT_URL_AFTER_LOGIN);
  }

  public removeRedirectUrlAfterLogin(): void {
    sessionStorage.removeItem(STORAGE_KEY.REDIRECT_URL_AFTER_LOGIN);
  }

  setPassword(): void {
    localStorage.setItem(STORAGE_KEY.IS_SET_PASSWORD, 'true');
  }
  isSetPassword(): boolean {
    return localStorage.getItem(STORAGE_KEY.IS_SET_PASSWORD) === 'true';
  }
  removePasswordData() {
    localStorage.removeItem(STORAGE_KEY.IS_SET_PASSWORD);
  }

  getCallbackUrl() {
    return sessionStorage.getItem(STORAGE_KEY.CALLBACK_URL);
  }

  saveCallbackUrl(value: string): void {
    sessionStorage.setItem(STORAGE_KEY.CALLBACK_URL, value);
  }

  public setTicketData(ticket: string, data: any): void {
    const storage = localStorage.getItem(STORAGE_KEY.DB_STORAGE);
    let storageObject = storage ? JSON.parse(storage) : null;
    storageObject = {
      ...storageObject,
      tickets: {
        ...storageObject.tickets,
        [ticket]: data,
      },
    };
    localStorage.setItem(STORAGE_KEY.DB_STORAGE, JSON.stringify(storageObject));
  }

  public getTicketData() {
    const storage = localStorage.getItem(STORAGE_KEY.DB_STORAGE);
    const storageObject = storage ? JSON.parse(storage) : null;
    return storageObject?.tickets || null;
  }

  public removeTicketData(ticket: PropertyKey): void {
    const storage = localStorage.getItem(STORAGE_KEY.DB_STORAGE);
    let storageObject = storage ? JSON.parse(storage) : null;
    const data = storageObject?.tickets;
    delete data[ticket];
    storageObject = { ...storageObject, tickets: { ...data } };
    localStorage.setItem(STORAGE_KEY.DB_STORAGE, JSON.stringify(storageObject));
  }

  public addResolveUrl(url: string): void {
    localStorage.setItem(STORAGE_KEY.DB_TARGET, url);
  }
  setHasBiometric(): void {
    localStorage.setItem(STORAGE_KEY.HAS_BIOMETRIC, 'true');
  }
  hasBiometric(): boolean {
    return localStorage.getItem(STORAGE_KEY.HAS_BIOMETRIC) === 'true';
  }
  removeHasBiometric() {
    localStorage.removeItem(STORAGE_KEY.HAS_BIOMETRIC);
  }

  getSearchHistory(): Array<string> {
    const history = localStorage.getItem(STORAGE_KEY.SEARCH_HISTORY);
    if (history) {
      return JSON.parse(history) as Array<string>;
    } else {
      return [];
    }
  }

  setSearchHistory(history: Array<string>): void {
    localStorage.setItem(STORAGE_KEY.SEARCH_HISTORY, JSON.stringify(history));
  }

  getHubSearchHistory(): Array<FrequentServicesIdEnum> {
    const history = localStorage.getItem(STORAGE_KEY.HUB_SEARCH_HISTORY);
    if (history) {
      return JSON.parse(history) as Array<FrequentServicesIdEnum>;
    } else {
      return [];
    }
  }

  setHubSearchHistory(history: Array<FrequentServicesIdEnum>): void {
    localStorage.setItem(STORAGE_KEY.HUB_SEARCH_HISTORY, JSON.stringify(history));
  }

  removeHubSearchHistory(): void {
    localStorage.removeItem(STORAGE_KEY.HUB_SEARCH_HISTORY);
  }
  setTimeStamp(time: number): void {
    localStorage.setItem(STORAGE_KEY.TIME_STAMP, JSON.stringify(time));
  }
  getTimeStamp(): string | null {
    const timeStampValue: string | null = localStorage.getItem(STORAGE_KEY.TIME_STAMP);
    return timeStampValue || null;
  }
  removeTimeStamp(): void {
    localStorage.removeItem(STORAGE_KEY.TIME_STAMP);
  }

  // Set redirectionTimestamp to make session valid not to display pin while return of redirections like: ipg ,shaparak , ... on hybrids
  setRedirectionTimestamp(time: number): void {
    localStorage.setItem(STORAGE_KEY.REDIRECT_TIME_STAMP, JSON.stringify(time));
  }

  getRedirectionTimestamp(): string | null {
    return localStorage.getItem(STORAGE_KEY.REDIRECT_TIME_STAMP) || null;
  }

  removeRedirectionTimestamp(): void {
    localStorage.removeItem(STORAGE_KEY.REDIRECT_TIME_STAMP);
  }

  getLocationTimeStamp(): number | null {
    const timestamp = localStorage.getItem(STORAGE_KEY.LOCATION_TIME_STAMP);
    if (timestamp) {
      return Number(timestamp);
    }
    return null;
  }

  setLocationTimeStamp(timestamp: number): void {
    localStorage.setItem(STORAGE_KEY.LOCATION_TIME_STAMP, String(timestamp));
  }

  removeLocationTimeStamp(): void {
    localStorage.removeItem(STORAGE_KEY.LOCATION_TIME_STAMP);
  }

  getNativeUpdateTimeStamp(): number | null {
    const timestamp = localStorage.getItem(STORAGE_KEY.UPDATE_TIME_STAMP);
    if (timestamp) {
      return Number(timestamp);
    }
    return null;
  }

  setNativeUpdateTimeStamp(timestamp: number): void {
    localStorage.setItem(STORAGE_KEY.UPDATE_TIME_STAMP, String(timestamp));
  }

  removeNativeUpdateTimeStamp(): void {
    localStorage.removeItem(STORAGE_KEY.UPDATE_TIME_STAMP);
  }

  setHasLocation(): void {
    localStorage.setItem(STORAGE_KEY.SET_LOCATION, 'true');
  }
  hasSetLocation(): boolean {
    return localStorage.getItem(STORAGE_KEY.SET_LOCATION) === 'true';
  }
  removeSetLocation() {
    localStorage.removeItem(STORAGE_KEY.SET_LOCATION);
  }

  getLastLocation(): Coordination | undefined {
    const lastLocation = localStorage.getItem(STORAGE_KEY.LAST_LOCATION);
    if (lastLocation) {
      return JSON.parse(lastLocation) as Coordination;
    } else {
      return undefined;
    }
  }

  setLastLocation(location: Coordination): void {
    localStorage.setItem(STORAGE_KEY.LAST_LOCATION, JSON.stringify(location));
  }

  removeLastLocation(): void {
    localStorage.removeItem(STORAGE_KEY.LAST_LOCATION);
  }

  getLocationEventTimeStamp(): number | null {
    const timestamp = localStorage.getItem(STORAGE_KEY.LOCATION_EVENT_TIME);
    if (timestamp) {
      return Number(timestamp);
    }
    return null;
  }

  setLocationEventTimeStamp(timestamp: number): void {
    localStorage.setItem(STORAGE_KEY.LOCATION_EVENT_TIME, String(timestamp));
  }

  removeLocationEventTimeStamp(): void {
    localStorage.removeItem(STORAGE_KEY.LOCATION_EVENT_TIME);
  }

  setInputUtmData(utmData: InputUtmData): void {
    sessionStorage.setItem(STORAGE_KEY.UTM_SOURCE, utmData.source || '');
    sessionStorage.setItem(STORAGE_KEY.UTM_MEDIUM, utmData.medium || '');
    sessionStorage.setItem(STORAGE_KEY.UTM_CAMPAIGN, utmData.campaign || '');
  }

  getInputUtmData(): null | InputUtmData {
    const utmSource = sessionStorage.getItem(STORAGE_KEY.UTM_SOURCE);
    if (!utmSource) {
      return null;
    }
    const utmData: InputUtmData = { source: utmSource };
    utmData.medium = sessionStorage.getItem(STORAGE_KEY.UTM_MEDIUM) || '';
    utmData.campaign = sessionStorage.getItem(STORAGE_KEY.UTM_CAMPAIGN) || '';
    return utmData;
  }

  getSessionId(): string {
    if (!sessionStorage.getItem(STORAGE_KEY.DP_SESSION_ID)) {
      if (crypto && typeof crypto.randomUUID === 'function') {
        sessionStorage.setItem(STORAGE_KEY.DP_SESSION_ID, crypto.randomUUID());
      }
    }
    return sessionStorage.getItem(STORAGE_KEY.DP_SESSION_ID) || '';
  }

  setCheckHubOnboarding(): void {
    localStorage.setItem(STORAGE_KEY.HUB_ONBOARDING, 'true');
  }

  hasCheckHubOnboarding(): boolean {
    return localStorage.getItem(STORAGE_KEY.HUB_ONBOARDING) === 'true';
  }

  storeDigipayCardOnboardingChecked(): void {
    localStorage.setItem(STORAGE_KEY.DIGIPAY_CARD_ONBOARDING_CHECKED, 'true');
  }

  isDigipayCardOnboardingChecked(): boolean {
    return localStorage.getItem(STORAGE_KEY.DIGIPAY_CARD_ONBOARDING_CHECKED) === 'true';
  }

  public removeDigiCardOnboardingChecked(): void {
    return localStorage.removeItem(STORAGE_KEY.DIGIPAY_CARD_ONBOARDING_CHECKED);
  }

  // methods to handle assets's hide status
  toggleAssetHide(key: string) {
    const stored = localStorage.getItem(STORAGE_KEY.ASSETS_HIDE_STATUS);
    const assetIsHide = stored ? JSON.parse(stored) : {};
    // Toggle the value (default is false)
    assetIsHide[key] = !this.getAssetsHideStatus()[key];
    localStorage.setItem(STORAGE_KEY.ASSETS_HIDE_STATUS, JSON.stringify(assetIsHide));
    return assetIsHide[key];
  }

  getAssetsHideStatus() {
    const stored = localStorage.getItem(STORAGE_KEY.ASSETS_HIDE_STATUS);
    const assetIsHide = stored ? JSON.parse(stored) : {};
    // Return stored value or default (false)
    return assetIsHide || false;
  }

  resetAssetHideStatus() {
    localStorage.removeItem(STORAGE_KEY.ASSETS_HIDE_STATUS);
  }

  setMessageApiCall(): void {
    sessionStorage.setItem(STORAGE_KEY.APP_MESSAGE_STORAGE_KEY, 'true');
  }

  isMessageApiCall(): boolean {
    return sessionStorage.getItem(STORAGE_KEY.APP_MESSAGE_STORAGE_KEY) === 'true';
  }

  getAppMessageTimeStamp(): number | null {
    const timestamp = localStorage.getItem(STORAGE_KEY.APP_MESSAGE_TIME_STAMP);
    if (timestamp) {
      return Number(timestamp);
    }
    return null;
  }

  setAppMessageTimeStamp(timestamp: number): void {
    localStorage.setItem(STORAGE_KEY.APP_MESSAGE_TIME_STAMP, String(timestamp));
  }

  removeAppMessageTimeStamp(): void {
    localStorage.removeItem(STORAGE_KEY.APP_MESSAGE_TIME_STAMP);
  }

  getVpnCheckTimeStamp(): number | null {
    const timestamp = localStorage.getItem(STORAGE_KEY.VPN_CHECK_TIME_STAMP);
    if (timestamp) {
      return Number(timestamp);
    }
    return null;
  }

  setVpnCheckTimeStamp(timestamp: number): void {
    localStorage.setItem(STORAGE_KEY.VPN_CHECK_TIME_STAMP, String(timestamp));
  }

  removeVpnCheckTimeStamp(): void {
    localStorage.removeItem(STORAGE_KEY.VPN_CHECK_TIME_STAMP);
  }
}
