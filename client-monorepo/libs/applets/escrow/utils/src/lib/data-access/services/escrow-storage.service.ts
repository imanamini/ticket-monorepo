import { Injectable } from '@angular/core';
import { PossibleStorageItems } from '../constants/storage-items';

@Injectable({
  providedIn: 'root',
})
export class EscrowStorageService {
  private isJsonString(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  getItem(key: PossibleStorageItems): any {
    const storageData = localStorage.getItem('__dp_storage_escrow');
    const storage = storageData ? JSON.parse(storageData) : { escrow: {} };
    const value = storage.escrow[key] ?? null;

    if (value && typeof value === 'string' && this.isJsonString(value)) {
      return JSON.parse(value);
    }

    return value;
  }

  setItem(key: PossibleStorageItems, value: string | any): void {
    const storageData = localStorage.getItem('__dp_storage_escrow');
    const storage = storageData ? JSON.parse(storageData) : { escrow: {} };

    // Handle undefined/null values by not storing them
    if (value === undefined || value === null) {
      return;
    }

    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    storage.escrow = { ...storage.escrow, [key]: stringValue };
    localStorage.setItem('__dp_storage_escrow', JSON.stringify(storage));
  }

  deleteItem(key: PossibleStorageItems): void {
    const storageData = localStorage.getItem('__dp_storage_escrow');
    if (!storageData) return;

    const storage = JSON.parse(storageData);
    if (storage.escrow && Object.prototype.hasOwnProperty.call(storage.escrow, key)) {
      delete storage.escrow[key];
      localStorage.setItem('__dp_storage_escrow', JSON.stringify(storage));
    }
  }

  private getEscrowProperty<T>(key: string, defaultValue: T): T {
    const storageData = sessionStorage.getItem('__dp_storage_escrow');
    const storage = storageData ? JSON.parse(storageData) : { escrow: {} };
    return storage.escrow[key] ?? defaultValue;
  }

  private setEscrowProperty(key: string, value: any): void {
    const storageData = sessionStorage.getItem('__dp_storage_escrow');
    const storage = storageData ? JSON.parse(storageData) : { escrow: {} };
    storage.escrow = { ...storage.escrow, [key]: value };
    sessionStorage.setItem('__dp_storage_escrow', JSON.stringify(storage));
  }

  initEscrowProperties() {
    this.setEscrowUUID('');
    this.setEscrowCellNumber('');
    this.setEscrowTrustedLogin(false);
    this.setEscrowTrackingCode('');
  }

  setEscrowUUID(uuid: string | null): void {
    this.setEscrowProperty('uuid', uuid);
  }

  setEscrowPaymentLinkDetail(result: any): void {
    this.setEscrowProperty('paymentLink', result);
  }

  setEscrowIsMerchant(isMerchant: boolean): void {
    this.setEscrowProperty('isMerchant', isMerchant);
  }

  getEscrowPaymentLinkDetail(): any {
    return this.getEscrowProperty('paymentLink', false);
  }

  getEscrowIsMerchant(): boolean {
    return this.getEscrowProperty('isMerchant', false);
  }

  setEscrowSellerOnboarding(isOnboard: boolean): void {
    this.setEscrowProperty('isOnboard', isOnboard);
  }

  getEscrowSellerOnboarding(): boolean {
    return this.getEscrowProperty('isOnboard', false);
  }

  getEscrowUUID(): string {
    return this.getEscrowProperty('uuid', '');
  }

  setEscrowCellNumber(cellNumber: string | null): void {
    this.setEscrowProperty('cellNumber', cellNumber);
  }

  getEscrowCellNumber(): string {
    return this.getEscrowProperty('cellNumber', '');
  }

  setEscrowTrackingCode(trackingCode: string | null): void {
    this.setEscrowProperty('trackingCode', trackingCode);
  }

  getEscrowTrackingCode(): string {
    return this.getEscrowProperty('trackingCode', '');
  }

  setEscrowTrustedLogin(isTrusted: boolean): void {
    this.setEscrowProperty('isTrusted', isTrusted);
  }

  getEscrowTrustedLogin(): boolean {
    return this.getEscrowProperty('isTrusted', false);
  }

  setEscrowPluginActivationReturnUrl(returnUrl: string): void {
    this.setEscrowProperty('returnUrl', returnUrl);
  }

  getEscrowPluginActivationReturnUrl(): string {
    return this.getEscrowProperty('returnUrl', '');
  }

  setEscrowPluginActivationPostToken(postToken: string): void {
    this.setEscrowProperty('postToken', postToken);
  }

  getEscrowPluginActivationPostToken(): string {
    return this.getEscrowProperty('postToken', '');
  }

  setEscrowBottomSheetOnboarding(onboarding: boolean): void {
    this.setEscrowProperty('onboarding', onboarding);
  }

  getEscrowBottomSheetOnboarding(): string {
    return this.getEscrowProperty('onboarding', '');
  }

  setEscrowLastUserRole(userRole: string): void {
    this.setEscrowProperty('userRole', userRole);
  }

  getEscrowLastUserRole(): string {
    return this.getEscrowProperty('userRole', '');
  }
}
