import { Injectable } from '@angular/core';
import { ApiService } from '../../../../data-access/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralResponse } from '../../../equipment/api/models/api-result.model';
import { SubscriptionModel } from '../model/subscription.model';
import { SubscriptionInfoModel } from '../model/subscription-info.model';
import { UploadPictureModel } from '../../../equipment/routes/used/steps/used-upload-file/model/upload-picture.model';
import { HealthCheckBodyModel } from '../../../equipment/api/models/renewal/health-check-body.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionApiService extends ApiService {

  constructor(
    private httpClient: HttpClient,
  ) {
    super(httpClient);
  }

  getPolicyInfo(uniqueCode: string): Observable<GeneralResponse<SubscriptionModel>> {
    return super.get('insurance/policy/get-offline-policy?key=' + uniqueCode);
  }

  setInformation(body: SubscriptionInfoModel): Observable<GeneralResponse<null>> {
    return super.post('insurance/policy/set-serial-offline-policy', body);
  }

  uploadImage(file: FormData): Observable<any> {
    return this.httpClient.post('/digipay/api/insurance/policy/upload-offline-documnet', file, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteImage(
    body: { type: UploadPictureModel, key: string }
  ): Observable<any> {
    return super.post('insurance/policy/delete-offline-document', body);
  }

  checkDocument(body: {
    key: string;
    isImageFrontTwo: boolean;
  }): Observable<GeneralResponse<boolean>> {
    return super.post('/insurance/policy/check-offline-document ', body);
  }

  setHealthCheck(body: HealthCheckBodyModel): Observable<GeneralResponse<any>> {
    return super.post('/insurance/policy/active-offline-policy', body);
  }
}
