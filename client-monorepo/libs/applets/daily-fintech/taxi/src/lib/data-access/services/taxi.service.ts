import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaxiConfirmDataModel } from '../models/taxi-confirm-data.model';

@Injectable({
  providedIn: 'root',
})
export class TaxiService {
  taxiConfirmData = new BehaviorSubject<TaxiConfirmDataModel | null>(null);

  setTaxiConfirmData(data: TaxiConfirmDataModel) {
    this.taxiConfirmData.next(data);
  }
}
