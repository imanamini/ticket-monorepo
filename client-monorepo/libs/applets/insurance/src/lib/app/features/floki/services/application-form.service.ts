import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationFormModel } from '../models/application-form.model';
import { DraftModel } from '../models/draft.model';
import { PrepaymentRequestModel } from '../models/prepayment-request.model';
import { PrepaymentResponseModel } from '../models/prepayment-response.model';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { CheckHybridModel } from '../pages/payment/check-hybrid/check-hybrid.model';
import { ApiService } from '../../../data-access/services/api.service';
import { ReferrerService } from '../../../data-access/services/referrer.service';
import { NoInterceptorService } from '../../../data-access/services/no-interceptor.service';
import { GeneralFlokiResponse } from '../../../data-access/models/floki/api-floki-result.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationFormService extends ApiService {
  private ngxHybridServiceService = inject(NgxHybridServiceService);
  private referrerService = inject(ReferrerService);
  private noInterceptorService = inject(NoInterceptorService);

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  patchApplicationForm(body: ApplicationFormModel): Observable<GeneralFlokiResponse<DraftModel>> {
    return super.put('application-forms/insured-assets', body);
  }

  getApplicationFormDocument(formId: string, documentName: string): Observable<Blob> {
    return this.http.get<Blob>(`/digipay/api/insurance/v1/application-forms/${formId}/docs/${documentName}`, {
      observe: 'body',
      responseType: 'blob' as 'json',
    });
  }

  getAvailableProducts(id: string): Observable<GeneralFlokiResponse<ApplicationFormModel>> {
    return super.get(`/application-forms/${id}/available-products?productCategoryPath=used`);
  }

  setDrafts(id: string, productId: string): Observable<GeneralFlokiResponse<DraftModel>> {
    return super.put(`/application-forms/${id}/drafts`, { productId });
  }

  getDraftsWithoutInterceptor(appId: string): Observable<GeneralFlokiResponse<DraftModel>> {
    return this.noInterceptorService.get(`application-forms/${appId}`, { tokenType: 'none' });
  }

  getDraftsWithInterceptor(appId: string): Observable<GeneralFlokiResponse<DraftModel>> {
    return super.get(`/application-forms/${appId}`);
  }

  setDiscount(discountCode: string, applicationFormId: string): Observable<GeneralFlokiResponse<DraftModel>> {
    return super.put(`/application-forms/${applicationFormId}/discount`, { discountCode });
  }

  prePayment(applicationFormId: string): Observable<GeneralFlokiResponse<PrepaymentResponseModel>> {
    const model: PrepaymentRequestModel = {
      isHybrid: this.ngxHybridServiceService.isHybrid(),
      origin: window.location.host,
      referrer: this.referrerService.referrer,
    };
    return super.put(`/application-forms/${applicationFormId}/pre-payments`, model);
  }

  checkHybrid(paymentId: string): Observable<GeneralFlokiResponse<CheckHybridModel>> {
    return super.get(`/application-forms/payments/check-hybrid?paymentId=` + paymentId);
  }

  checkPaymentResult(applicationFormId: string, paymentId: string): Observable<GeneralFlokiResponse<CheckHybridModel>> {
    return super.get(`/application-forms/${applicationFormId}/payments/${paymentId}`);
  }

  getImageFile(applicationFormId: string, imageName: string): Observable<any> {
    return super.get(
      `/application-forms/${applicationFormId}/docs/${imageName}`,
      null,
      new HttpHeaders().append('responseType', 'arraybuffer'),
      { responseType: 'blob' },
    );
  }

  getTermsAndConditions(applicationFormId: string, productId: string): Observable<GeneralFlokiResponse<any>> {
    return super.get(`/application-forms/${applicationFormId}/products/${productId}`);
  }

  completions(applicationFormId: string): Observable<GeneralFlokiResponse<{ fileName: string }>> {
    return super.put(`/application-forms/${applicationFormId}/completions`);
  }
}
