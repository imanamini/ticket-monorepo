import { Injectable } from '@angular/core';
import { QrDetectBodyModel } from '../models/qr-detect-body-model';
import { Observable } from 'rxjs';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { QrDetectResponseModel } from '../models/qr-detected-response.model';
import { UserDetailResponse } from '../models/UserDetailResponse';
import { Barcode, CreditTypesResponse, PurchaseConfirmation, PurchaseResult } from '../models/barcode.model';

@Injectable({
  providedIn: 'root',
})
export class ScannerApiService {
  constructor(private apiService: ApiService) {}

  checkQrTypeApi(data: QrDetectBodyModel): Observable<QrDetectResponseModel> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'qr/detect', data);
    return this.apiService.call<QrDetectResponseModel>(request);
  }

  generateMyQrImage() {
    const payload = {
      action: 1,
      payload: 'payload',
    };
    const request = new RequestBuilder(RequestTypeEnum.GET_IMAGE_BY_POST_REQUEST, 'files/qrcode', payload);
    return this.apiService.call(request);
  }

  getParameterByName(name: string, url: string): any {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  getUserDetail(cellNumber: string): Observable<UserDetailResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `users/${cellNumber}`);
    return this.apiService.call<UserDetailResponse>(request);
  }

  getBarcodeCreditType(): Observable<CreditTypesResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `payment/marketplace/barcodes/credit-types`);
    return this.apiService.call<any>(request);
  }

  getBarcode(creditId: string): Observable<Barcode> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `payment/marketplace/barcodes`, { creditId });
    return this.apiService.call(request);
  }

  barcodePurchaseConfirmation(barcodeId: string): Observable<PurchaseConfirmation> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `payment/marketplace/barcodes/purchases/confirmation/${barcodeId}`);
    return this.apiService.call<PurchaseConfirmation>(request);
  }

  rejectPurchase(barcodeNumber: number): Observable<PurchaseResult> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `payment/marketplace/barcodes/purchases/reject`, { barcodeNumber });
    return this.apiService.call<PurchaseResult>(request);
  }

  acceptPurchase(barcodeNumber: number): Observable<PurchaseResult> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `payment/marketplace/barcodes/purchases/accept`, { barcodeNumber });
    return this.apiService.call<PurchaseResult>(request);
  }
}
