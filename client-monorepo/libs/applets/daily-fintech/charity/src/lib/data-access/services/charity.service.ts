import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CharityPurchaseModel } from '../models/charity-purchase.model';

@Injectable({
  providedIn: 'root',
})
export class CharityService {
  charityData = new BehaviorSubject<CharityPurchaseModel | null>(null);

  setCharityData(data: CharityPurchaseModel) {
    this.charityData.next(data);
  }
}
