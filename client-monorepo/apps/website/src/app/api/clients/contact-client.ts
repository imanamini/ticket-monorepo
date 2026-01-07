import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../base-http-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactClient extends BaseHttpClient {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  submitContactForm(
    formId: string,
    values: any,
  ): Observable<{
    info: {
      message: string;
    };
    errors?: string;
  }> {
    return super.post('/api/communication/contact/message/' + formId, {
      values,
    });
  }
}
