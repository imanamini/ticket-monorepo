import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {ApiService} from "../../../core/http/api.service";

@Injectable({
  providedIn: 'root'
})
export class FileApiService {

  constructor(
    public apiService: ApiService
  ) {
  }

  getPage(pageFileId): Observable<any> {
    return this.apiService.getText('/files/' + pageFileId);
  }
}
