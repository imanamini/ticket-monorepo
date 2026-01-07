import { PROVIDER_ID } from '../consts/storage-key';

export function GetProviderId(): string {
  return sessionStorage.getItem(PROVIDER_ID);
}

export function SaveProviderId(value: string,): void {
  sessionStorage.setItem(PROVIDER_ID, value);
}
