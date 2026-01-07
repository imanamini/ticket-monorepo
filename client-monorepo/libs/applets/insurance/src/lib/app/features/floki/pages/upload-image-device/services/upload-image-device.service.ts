import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceTypeEnum } from '../models/device-type.enum';
import { DraftModel } from '../../../models/draft.model';
import { ApiService } from '../../../../../data-access/services/api.service';
import { GeneralFlokiResponse } from '../../../../../data-access/models/floki/api-floki-result.model';

@Injectable({
  providedIn: 'root',
})
export class UploadImageDeviceService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getApplicationForm(appId: string): Observable<GeneralFlokiResponse<DraftModel>> {
    return super.get(`application-forms/${appId}`);
  }

  putApplicationDocument(File: FormData, formId: string, documentType: DeviceTypeEnum): Observable<any> {
    return this.http.put(`/digipay/api/insurance/v1/application-forms/${formId}/docs`, File);
  }

  deleteApplicationDocument(fileName: string, formId: string): Observable<any> {
    return this.http.delete(`/digipay/api/insurance/v1/application-forms/${formId}/docs/${fileName}`);
  }

  getApplicationDocument(formId: string, fileName: string): Observable<Blob> {
    return this.http.get<Blob>(`/digipay/api/insurance/v1/application-forms/${formId}/docs/${fileName}`, {
      observe: 'body',
      responseType: 'blob' as 'json',
    });
  }
}
