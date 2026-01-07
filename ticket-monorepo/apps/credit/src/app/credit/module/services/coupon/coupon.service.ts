import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { CreditHttpService } from '../../../api/credit-http.service';
import { StorageService } from '../../../core/services/storage.service';
import { CouponModel, ValidateCouponPayload, ValidateCouponResponse } from './models/coupon.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  // Services
  private api = inject(CreditHttpService);
  private storageService = inject(StorageService);

  // Signals
  #coupons = signal<Record<string, CouponModel>>({});

  getCoupon(creditId: string) {
    return this.#coupons()[creditId];
  }

  updateCoupons(creditId: string, coupon: CouponModel) {
    this.#coupons.update(prev => {
      return {
        ...prev,
        [creditId]: coupon,
      };
    });
  }

  ValidateCoupon(payload: ValidateCouponPayload): Observable<ValidateCouponResponse> {
    const ticket = this.storageService.get('ticket');
    return this.api.post(
      `credit/purchases/coupon/validate/${ticket}`,
      payload,
      new HttpHeaders().set('ticket', ticket || '').set('Content-Type', 'application/json')
    );
  }
}
