import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InsuredPartiesModel } from '../models/insured-parties.model';
import { ApiService } from '../../../../../data-access/services/api.service';
import { GeneralFlokiResponse } from '../../../../../data-access/models/floki/api-floki-result.model';
@Injectable({
  providedIn: 'root',
})
export class InsuredPartiesService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  patchInsuredParties(formId: string, body: InsuredPartiesModel): Observable<GeneralFlokiResponse<InsuredPartiesModel>> {
    return super.put(`application-forms/${formId}/insured-parties`, body);
  }
}
