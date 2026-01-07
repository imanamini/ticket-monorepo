import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsedStoredDeviceInfoModel } from '../models/used-stored-device-info.model';
import { RegisterTypes } from '../models/used-register-types.model';
import { PurchaseHistoryListModel } from '../../../../../api/models/used/purchase-history-list.model';

@Injectable({
  providedIn: 'root'
})
export class UsedDeviceInfoService {

  constructor() {
  }

  private showDevicesListBehaviorSubject = new BehaviorSubject<boolean>(false);
  private showBrandPickerBehaviorSubject = new BehaviorSubject<boolean>(true);
  private purchaseListHistoryBehaviorSubject = new BehaviorSubject<PurchaseHistoryListModel[]>([]);
  private showCustomBrandModelBehaviorSubject = new BehaviorSubject<boolean>(false);
  private storedDeviceInfoKey = 'StoredDeviceInfo';
  private registerTypesBehaviorSubject = new BehaviorSubject<RegisterTypes>(RegisterTypes.BrandModelList);

  getShowDevicesList(): Observable<boolean> {
    return this.showDevicesListBehaviorSubject.asObservable();
  }

  setShowDevicesList(value: boolean): void {
    this.showDevicesListBehaviorSubject.next(value);
  }

  getShowBrandPicker(): Observable<boolean> {
    return this.showBrandPickerBehaviorSubject.asObservable();
  }

  getShowBrandPickerValue(): boolean {
    return this.showBrandPickerBehaviorSubject.getValue();
  }

  setShowBrandPicker(value: boolean): void {
    this.showBrandPickerBehaviorSubject.next(value);
  }

  getPurchaseList(): Observable<PurchaseHistoryListModel[]> {
    return this.purchaseListHistoryBehaviorSubject.asObservable();
  }

  setPurchaseList(value: PurchaseHistoryListModel[]): void {
    this.purchaseListHistoryBehaviorSubject.next(value);
  }

  getShowCustomBrandModel(): Observable<boolean> {
    return this.showCustomBrandModelBehaviorSubject.asObservable();
  }

  setShowCustomBrandModel(value: boolean): void {
    this.showCustomBrandModelBehaviorSubject.next(value);
  }

  getStoredDeviceInfo(): UsedStoredDeviceInfoModel {
    if (localStorage.getItem(this.storedDeviceInfoKey)) {
      return JSON.parse(localStorage.getItem(this.storedDeviceInfoKey)) as UsedStoredDeviceInfoModel;
    } else {
      return {};
    }
  }

  setStoredDeviceInfo(value: UsedStoredDeviceInfoModel): void {
    localStorage.setItem(this.storedDeviceInfoKey, JSON.stringify(value));
  }

  purgeStoredDeviceInfo(): void {
    if (localStorage.getItem(this.storedDeviceInfoKey)) {
      localStorage.removeItem(this.storedDeviceInfoKey);
    }
  }

  setRegisterType(type: RegisterTypes): void {
    this.registerTypesBehaviorSubject.next(type);
  }

  getRegisterTypeValue(): RegisterTypes {
    return this.registerTypesBehaviorSubject.getValue();
  }
}
