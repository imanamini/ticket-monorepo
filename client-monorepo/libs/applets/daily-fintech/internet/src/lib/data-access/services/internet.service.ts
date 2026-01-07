import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InternetConfirm } from '../models/internet-confirm.model';
import { InternetPackage } from '../models/internet-purchase.response';

@Injectable({
  providedIn: 'root',
})
export class InternetService {
  confirmData = new BehaviorSubject<InternetConfirm | null>(null);
  packageInfo = new BehaviorSubject<InternetPackage | null>(null);

  setConfirmData(confirmData: InternetConfirm) {
    this.confirmData.next(confirmData);
  }

  getConfirmData() {
    return this.confirmData.asObservable();
  }

  setPackageData(packageInfo: InternetPackage) {
    this.packageInfo.next(packageInfo);
  }

  getPackageData() {
    return this.packageInfo.asObservable();
  }
}
