import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UploadPictureModel } from '../model/upload-picture.model';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../../../../data-access/services/api.service';
import { TabChangeModel } from '../model/tab-change.model';

@Injectable({
  providedIn: 'root'
})
export class UsedUploadService extends ApiService {
  constructor(
    private httpClient: HttpClient,
  ) {//TODO: remove baseurl after fix routing
    super(httpClient);
  }

  uploadDocument(File: FormData): any {
    //TODO: remove baseurl after fix routing
    return this.http.post('../../digipay/api/insurance/used/upload', File, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteDocument(
    body: { type: UploadPictureModel, key: string }
  ): Observable<any> {
    return super.post('insurance/used/delete-document', body);
  }

  setTabFromServer(
    body: { tab: TabChangeModel, key: string }
  ): Observable<any> {
    return super.post('insurance/used/set-tab', body);
  }
}
