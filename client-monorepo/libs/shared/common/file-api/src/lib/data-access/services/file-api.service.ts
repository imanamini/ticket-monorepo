import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { map, Observable } from 'rxjs';
import { FileService } from './file-service';

@Injectable({
  providedIn: 'root',
})
export class FileApiService {
  apiService = inject(ApiService);
  fileService = inject(FileService);

  getGuidePage(url: string): Observable<string> {
    const request = new RequestBuilder(RequestTypeEnum.GET_PAGE, url);
    return this.apiService.call(request);
  }

  getTermsAndConditionPage(): Observable<string> {
    const requestBuilder = new RequestBuilder(RequestTypeEnum.GET_PAGE, 'files/tac');
    return this.apiService.call(requestBuilder).pipe(map((content) => this.fileService.getBodyTag(content as string)));
  }
}
