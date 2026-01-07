import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpClient } from '../base-http-client';
import { GetTicketDetailResponse } from './response-models/get-ticket-detail.response';
import { GetStepsResponse } from './response-models/get-steps.response';
import { BaseApiResponse } from '../../models/base-api.response';
import { Merchant } from '../../models/registration/merchant';
import { PaymentDetailItem } from '../../models/registration/payment/payment-detail';
import { PaymentInitResponse } from '../../models/payment/payment-init.response';
import { SetUserDetailsRequest } from '../../models/registration/set-user-details.request';
import { VerifyOtpResponse } from '../../models/otp/verify-otp.response';
import { SignatureConfigResponse } from '../../models/signature/signature-config.response';
import { SignatureGenerateResponse } from '../../models/signature/signature-generate.response';
import { SignatureDetailsResponse } from '../../models/signature/signature-details.response';
import { SignableDocumentConfigResponse } from '../../models/signable-doc/signable-document-config.response';
import { SignableDocumentsResponse } from '../../models/signable-doc/signable-documents.response';
import { UploadableFile } from '../../models/upload/uploadable-file';

@Injectable({
  providedIn: 'root'
})
export class RegistrationApiService extends BaseHttpClient {
  baseUrl: string = 'merchant/credit';

  getMerchants(): Observable<{ merchants: Merchant[] }> {
    return super.get('credit/merchants');
  }

  getNewTicketDetail(creditId: string | null): Observable<GetTicketDetailResponse> {
    return super.get(`${this.baseUrl}/${creditId}/detail`);
  }

  getSteps(creditId: string): Observable<GetStepsResponse> {
    return super.get(`${this.baseUrl}/${creditId}/steps`);
  }

  cancel(creditId: string, uid: string, message: string): Observable<BaseApiResponse> {
    return super.post(`${this.baseUrl}/${creditId}/cancel`, {uid, message});
  }

  reviseMaxAmount(registrationId: string, maxAmount: number, iban?: string): Observable<BaseApiResponse> {
    let body: {};
    if (iban) {
      body = {
        iban: iban,
        maxAmount: maxAmount
      };
    } else {
      body = {
        maxAmount: maxAmount
      };

    }
    return super.put(`${this.baseUrl}/${registrationId}/max-amount`, body);
  }

  middleEastReviseMaxAmount(registrationId: string, maxAmount: number, registerCellNumber?: string): Observable<BaseApiResponse> {
    let body: {};
    body = {
      maxAmount: maxAmount,
      registerCellNumber: registerCellNumber
    };
    return super.put(`${this.baseUrl}/${registrationId}/max-amount`, body);
  }

  initializePayment(creditId: string): Observable<{ trackingCode: string }> {
    return super.put(`${this.baseUrl}/${creditId}/payment/init`);
  }

  getPaymentDetails(id: string): Observable<{
    details: PaymentDetailItem[],
    totalAmount: number,
    description: string
  }> {
    return super.get(`${this.baseUrl}/payment/${id}/detail`);
  }

  getTicketForPayment(trackingCode: string, callbackUrl: string): Observable<PaymentInitResponse> {
    return super.post(`payments/init`, {
      trackingCode,
      callbackUrl,
    });
  }

  initializeIdentityEvaluation(creditId: string, birthDate: string): Observable<any> {
    return super.post(`${this.baseUrl}/identity-evaluation/${creditId}/init`, {
      birthDate
    });
  }

  resendOtp(creditId: string): Observable<any> {
    return super.post(`${this.baseUrl}/${creditId}/otp`);
  }

  verifyOtp(creditId: string, code: string): Observable<VerifyOtpResponse> {
    return super.post(`${this.baseUrl}/${creditId}/otp/verify`, {
      otpCode: code
    });
  }

  setBasicDetails(creditId: string, formData: SetUserDetailsRequest): Observable<any> {
    return super.post(`${this.baseUrl}/identity-evaluation/${creditId}/set-detail`, formData);
  }

  setAddress(creditId: string, body: { address: string, cityCode: string, provinceCode: string }): Observable<any> {
    return super.post(`${this.baseUrl}/identity-evaluation/${creditId}/set-address`, body);
  }

  getSignatureConfig(creditId: string): Observable<SignatureConfigResponse> {
    return super.get(`${this.baseUrl}/digital-signature/${creditId}/config`);
  }

  initDigitalSignature(creditId: string): Observable<{ trackingCode: string }> {
    return super.post(`${this.baseUrl}/digital-signature/${creditId}/initiate`);
  }

  getUrlForCreatingSignature(trackingCode: string, callbackUrl: string): Observable<{ redirectUrl: string }> {
    return super.get(`${this.baseUrl}/digital-signature/verifyExt`, {
      trackingCode,
      callbackUrl
    });
  }

  generateSignature(creditId: string): Observable<SignatureGenerateResponse> {
    return super.post(`${this.baseUrl}/digital-signature/${creditId}/generate`);
  }

  generateSignatureForNewUsers(creditId: string, password: string): Observable<SignatureGenerateResponse> {
    return super.post(`${this.baseUrl}/digital-signature/${creditId}/generate`, {
      password: password
    });
  }

  getSignatureDetailsForNewUsers(creditId: string): Observable<SignatureDetailsResponse> {
    return super.get(`${this.baseUrl}/digital-signature/${creditId}/detail`);
  }

  generateSignableDocuments(creditId: string): Observable<any> {
    return super.post(`${this.baseUrl}/${creditId}/signable-documents/generate`);
  }

  getSignableDocumentsConfig(creditId: string): Observable<SignableDocumentConfigResponse> {
    return super.get(`${this.baseUrl}/${creditId}/signable-documents/config`);
  }

  getSignableDocuments(creditId: string): Observable<SignableDocumentsResponse> {
    return super.get(`${this.baseUrl}/${creditId}/signable-documents`);
  }

  getListOfDocumentsForUploading(creditId: string): Observable<{ detailsModels: UploadableFile[] }> {
    return super.get(`${this.baseUrl}/${creditId}/documents/detail`);
  }

  uploadDocument(creditId: string, fileId: string, file: File): Observable<BaseApiResponse> {
    const formData = new FormData();
    formData.set('file', file);
    return super.multipartPost(`${this.baseUrl}/${creditId}/documents/upload/${fileId}`, formData);
  }

  approveDocuments(creditId: string): Observable<any> {
    return super.post(`${this.baseUrl}/${creditId}/documents/approve`);
  }

  submitInformation(creditId: string): Observable<BaseApiResponse> {
    return super.put(`${this.baseUrl}/${creditId}/submit`);
  }

  getDocumentFile(fileId: string): Observable<Blob> {
    return super.getBinaryFile('contents/' + fileId);
  }

  signDocument(creditId: string, trackingCode: string): Observable<BaseApiResponse> {
    return super.post(`${this.baseUrl}/digital-signature/${creditId}/sign`, {
      trackingCode
    });
  }

  signDocumentForNewUser(creditId: string, trackingCode: string, password: string): Observable<BaseApiResponse> {
    return super.post(`${this.baseUrl}/digital-signature/${creditId}/sign`, {
      trackingCode,
      password
    });
  }
}
