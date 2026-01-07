import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClaimSendFileService {
  constructor(
    private http: HttpClient
  ) {
  }

  uploadDocument(File: FormData): any {
    //TODO: remove baseurl after fix routing
    return this.http.post('../../digipay/api/insurance/claim/upload', File, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
