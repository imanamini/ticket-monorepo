import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DamagesDocumentModel } from '../../../features/equipment/api/models/damages/damages-document.model';
import { AddClaimModel, ClaimModel } from '../../../features/equipment/api/models/claim/claim-models';
import { GeneralResponse } from '../../../features/equipment/api/models/api-result.model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ClaimApiService extends ApiService {
  constructor(
    private httpClient: HttpClient,
  ) {
    super(httpClient);
  }

  getClaimList(query: {}): Observable<GeneralResponse<ClaimModel[]>> {
    return super.post('/insurance/claim/list', query);
  }

  getDocumentTypeList(): Observable<GeneralResponse<DamagesDocumentModel[]>> {
    return super.get('/insurance/workflow/document-types');
  }

  addClaim(body: AddClaimModel): Observable<GeneralResponse<any>> {
    return super.post('insurance/claim/add', body);
  }

}
