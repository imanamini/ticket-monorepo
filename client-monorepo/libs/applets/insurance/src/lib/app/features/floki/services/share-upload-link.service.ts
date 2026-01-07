import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadLinkResponseModel } from '../models/upload-link-response.model';
import { UploadLinkEnum } from '../enums/upload-link.enum';
import { ApiService } from '../../../data-access/services/api.service';
import { GeneralFlokiResponse } from '../../../data-access/models/floki/api-floki-result.model';

@Injectable({
  providedIn: 'root',
})
export class ShareUploadLinkService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getUploadLink(applicationFormId: string, type: UploadLinkEnum): Observable<GeneralFlokiResponse<UploadLinkResponseModel>> {
    return super.post(`/application-forms/${applicationFormId}/upload-link?type=${type}`, {
      userId: '',
    });
  }

  getUploadStatus(applicationFormId: string): Observable<GeneralFlokiResponse<UploadLinkEnum>> {
    return super.get(`/application-forms/${applicationFormId}/upload-status`);
  }

  sendSmsUploadLink(applicationFormId: string, mobile: string): Observable<GeneralFlokiResponse<void>> {
    return super.post(`/application-forms/${applicationFormId}/upload-link/send-sms`, {
      mobile,
    });
  }
}
