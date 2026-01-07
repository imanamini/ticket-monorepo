import { Component, inject, OnInit } from '@angular/core';
import { Base64 } from 'js-base64';
import { fixActivityInfoArray } from '../../../utils/strings';
import { PaymentResult, PaymentResultModel } from './payment-result.model';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.scss']
})
export class PaymentResultComponent implements OnInit {

  result?: PaymentResultModel;
  paymentResultEnum = PaymentResult;
  errorMode?: 'no-data' | 'invalid-data';

  router = inject(Router);
  storage = inject(StorageService);

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('data')) {

      let data = urlParams.get('data');

      if (data) {
        data = decodeURIComponent(data);
        try {
          const result = JSON.parse(Base64.decode(data));
          result.activityInfo = result.activityInfo ? fixActivityInfoArray(result.activityInfo) : [];
          result.activityInfo = this.updateObjectValues(result.activityInfo);
          this.result = result;
        } catch (e) {
          this.errorMode = 'invalid-data';
        }
      }
    } else {
      this.errorMode = 'no-data';
    }
  }

  updateObjectValues(obj: any): any {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (Array.isArray(value)) {
          value.forEach((item) => this.updateObjectValues(item));
        } else if (typeof value === 'object' && value !== null) {
          this.updateObjectValues(value);
        }

        if (key === 'key' && value === 'کد پیگیری درخواست تسویه زودتر از موعد') {
          obj[key] = 'کد پیگیری درخواست';
        }
      }
    }
    return obj;
  }
}
