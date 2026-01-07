import { CardInfoEnteredByUserInterface } from '../models/card-info-entered-by-user.interface';
import {CardProfile} from "../models/card-profile-response.model";

export function saveSelectedUserAmount(value: number) {
  sessionStorage.setItem('__selectedUserAmount', value.toString());
}

export function getSelectedUserAmount(): string {
  return sessionStorage.getItem('__selectedUserAmount');
}

export function saveTacUrl(value: string) {
  sessionStorage.setItem('__tacUrl', value);
}

export function getTacUrl() {
  return sessionStorage.getItem('__tacUrl');
}

export function saveTransferKey(value: string) {
  sessionStorage.setItem('__transferKey', value);
}

export function getTransferKey(): string {
  return sessionStorage.getItem('__transferKey');
}

export function saveSelectedCardProfile(value: CardProfile) {
  sessionStorage.setItem('__selectedCardProfile', JSON.stringify(value));
}

export function getSelectedCardProfile(): string {
  return sessionStorage.getItem('__selectedCardProfile');
}

export function saveCardInfoEnteredByUser(value: CardInfoEnteredByUserInterface) {
  sessionStorage.setItem('__cardInfoEnteredByUser', JSON.stringify(value));
}

export function getCardInfoEnteredByUser(): string {
  return sessionStorage.getItem('__cardInfoEnteredByUser');
}

export function saveFeeCharge(value: number): void {
  sessionStorage.setItem('__feeCharge', JSON.stringify(value));
}

export function getFeeCharge(): string {
  return sessionStorage.getItem('__feeCharge');
}

// If user come from other app we have action query param in home page.
export function getActionQueryParam(): string {
  return sessionStorage.getItem('__actionQueryParam');
}

