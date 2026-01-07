import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UploadDocumentSettingsResponse
} from '../../models/third-party/upload-document/upload-document-settings.response';
import { UatGeneralResponse } from '../../models/uat-general.response';
import { BaseApiService } from '../shared/base-api.service';
import { UploadedDocumentModel } from '../../models/third-party/upload-document/uploaded-document.model';

@Injectable({
  providedIn: 'root'
})

export class DocumentApiService extends BaseApiService {

  getUploadedDocument(id: number, documentInsuranceType: 'Car' | 'Motor' = 'Car'): Observable<HttpResponse<Blob>> {
    return super.post(this.baseUrl + 'document/download', {id, documentInsuranceType}, null, {
      observe: 'response',
      responseType: 'blob',
      reportProgress: true
    });
  }

  uploadDocument(applicationFormId: string,
                 doc: UploadedDocumentModel,
                 file: File,
                 fileName?: string,
                 fileType?: number,
                 documentInsuranceType: 'Car' | 'Motor' = 'Car'): Observable<object> {
    const formData = new FormData();
    formData.append('File', file, file.name);
    return this.httpClient.post(`/digipay/api/insurance/vehicle-thirdparty/v1/document/upload?ApplicationFormId=${applicationFormId}${!!doc.id ? '&Id=' + doc.id : ''}${fileName ? ('&Filename=' + fileName) : ''}${fileType ? ('&Type=' + fileType) : ''}&DocumentInsuranceType=${documentInsuranceType}`, formData, {
      observe: 'response',
    });
  }

  removeUploadedDocument(documentId: number, documentInsuranceType: 'Car' | 'Motor' = 'Car'): Observable<UatGeneralResponse<string>> {
    return super.delete(`${this.baseUrl}document/remove`, documentId, null, {documentInsuranceType});
  }

  getUploadDocumentSettings(): Observable<UatGeneralResponse<UploadDocumentSettingsResponse>> {
    return super.get(this.baseUrl + 'document/settings');
  }

  checkOrderDocumentsBeingUploaded(applicationFormId: string, documentConflict: boolean): Observable<UatGeneralResponse<boolean>> {
    return super.get(`${this.baseUrl}application-forms/${applicationFormId}/documents/check?documentConflict=${documentConflict}`);
  }
}
