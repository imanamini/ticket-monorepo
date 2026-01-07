import { Inject, inject, Injectable } from '@angular/core';
import {
  CreditDigikalaAppWindow,
  HeaderChangeState,
  HeaderState,
  Platform,
} from '../../models/pillar/credit-digikala-hybrid-js-function.interface';
import { CREDIT_ENVIRONMENT } from '../../../credit-environment.interface';
import { CreditDigikalaSuperWebService } from './credit-digikala-super-web.service';

@Injectable({
  providedIn: 'root',
})
export class CreditDigikalaService {
  protected readonly isPillar = inject(CREDIT_ENVIRONMENT).creditEnv === 'pillar';
  private readonly digikalaSuperWeb = inject(CreditDigikalaSuperWebService);

  constructor(@Inject('APP_ENV') private readonly environment: { [key: string]: string }) {}

  public get isDigikala(): boolean {
    return this.isDigikalaSuperApp || this.digikalaSuperWeb.isDgkSuperWebUser;
  }

  public get isDigikalaSuperApp(): boolean {
    return this.window.SuperAppApi !== undefined && this.isPillar;
  }

  private get window(): CreditDigikalaAppWindow {
    return window as unknown as CreditDigikalaAppWindow;
  }

  public getSuperAppVersion(): number {
    return this.window.SuperAppApi.getSuperAppVersion();
  }

  public getSuperAppToken(): string | null {
    return this.window.SuperAppApi.getSuperAppToken();
  }

  public getScrollThreshold(): number {
    return this.window.SuperAppApi.getScrollThreshold();
  }

  public setHeaderState(state: HeaderState): void {
    this.window.SuperAppApi.setHeaderState(state);
  }

  public getAppVersion(): string {
    return this.window.SuperAppApi.getAppVersion();
  }

  public getPlatform(): Platform | 'web' {
    if (this.isDigikalaSuperApp) {
      return this.window.SuperAppApi.getPlatform();
    }
    return 'web';
  }

  public getPlatformVersion(): number {
    return this.window.SuperAppApi.getPlatformVersion();
  }

  public getBuildNumber(): number {
    return this.window.SuperAppApi.getBuildNumber();
  }

  public login(): void {
    this.window.SuperAppApi.login();
  }

  public logout(): void {
    this.window.SuperAppApi.logout();
  }

  public toast(content: string, duration: number): void {
    this.window.SuperAppApi.toast(content, duration);
  }

  public requestLocationPermission(cbFn: (granted: boolean) => void): void {
    this.window.SuperAppApi.requestLocationPermission(cbFn);
  }

  public persistLocalStorageOnIOS(localStorageData: string): void {
    this.window.SuperAppApi.persistLocalStorageOnIOS(localStorageData);
  }

  public getPersistedLocalStorageOnIOS(): string | null {
    return this.window.SuperAppApi.getPersistedLocalStorageOnIOS();
  }

  public persistLocalStorage(localStorageData: string): void {
    this.window.SuperAppApi.persistLocalStorage(localStorageData);
  }

  public getPersistedLocalStorage(): Promise<string | null> {
    return this.window.SuperAppApi.getPersistedLocalStorage();
  }

  public setPullToRefreshState(isActive: boolean): void {
    this.window.SuperAppApi.setPullToRefreshState(isActive);
  }

  public onBackHandler(cbFn: () => void): void {
    this.window.SuperAppApi.onBackHandler(cbFn);
  }

  public onHomePressed(cbFn: () => void): void {
    this.window.SuperAppApi.onHomePressed(cbFn);
  }

  public logger(log: string): void {
    this.window.SuperAppApi.logger(log);
  }

  public openExternalLink(url: string): void {
    if (this.isDigikalaSuperApp) {
      this.window.SuperAppApi.openExternalLink(url);
    } else {
      this.openInPopup(url);
    }
  }

  public gotoWebViewAction(url: string, title: string): void {
    if (this.isDigikalaSuperApp) {
      this.window.SuperAppApi.gotoWebViewAction(url, title);
    } else {
      this.openInPopup(url);
    }
  }

  public setHeaderChangeStateCallback(cbFn: (state: HeaderChangeState) => void): void {
    this.window.SuperAppApi.setHeaderChangeStateCallback(cbFn);
  }

  public requestCameraPermission(cbFn: (granted: boolean) => void): void {
    this.window.SuperAppApi.requestCameraPermission(cbFn);
  }

  public requestImagePermission(cbFn: (granted: boolean) => void): void {
    this.window.SuperAppApi.requestImagePermission(cbFn);
  }

  public requestRecordAudioPermission(cbFn: (granted: boolean) => void): void {
    this.window.SuperAppApi.requestRecordAudioPermission(cbFn);
  }

  public openLink(url: string): void {
    if (this.isDigikalaSuperApp) {
      this.window.SuperAppApi.openLink(url);
    } else {
      this.openInPopup(url);
    }
  }

  private openInPopup(url: string): void {
    const popUp: WindowProxy | null = window.open(url, '_self');
    try {
      popUp?.focus();
    } catch (e) {
      window.location.assign(url);
    }
  }

  public getSuperAppTokenAsync(): Promise<string> {
    return this.window.SuperAppApi.getSuperAppTokenAsync();
  }
}
