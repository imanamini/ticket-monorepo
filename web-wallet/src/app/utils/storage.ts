import {PERSISTENT_STORAGE_KEYS} from '../core/constants';


export function GetCallbackUrl(): string {
  return sessionStorage.getItem(PERSISTENT_STORAGE_KEYS.CALLBACK_URL);
}

export function SaveCallbackUrl(value: string): void {
  sessionStorage.setItem(PERSISTENT_STORAGE_KEYS.CALLBACK_URL, value);
}

export function GetTTL(ticket: string): string {
  return sessionStorage.getItem(PERSISTENT_STORAGE_KEYS.TTL + '_' + ticket);
}

export function SaveTTL(ticket: string, value: string): void {
  sessionStorage.setItem(PERSISTENT_STORAGE_KEYS.TTL + '_' + ticket, value);
}

export function RemoveAllStorage(): void {
  localStorage.clear();
  sessionStorage.clear();
}

export function GetPhoneNumber(): string {
  return sessionStorage.getItem(PERSISTENT_STORAGE_KEYS.PHONE_NUMBER);
}

export function SavePhoneNumber(value: string): void {
  sessionStorage.setItem(PERSISTENT_STORAGE_KEYS.PHONE_NUMBER, value);
}
