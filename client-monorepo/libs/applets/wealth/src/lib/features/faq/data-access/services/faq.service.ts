import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFaqResponse } from '../models';
import { BaseApiService } from '../../../../components/core/services/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  private faqUrl = 'wealth-assets/faq.json';
  private baseApiService = inject(BaseApiService);

  getFaq(): Observable<IFaqResponse> {
    return this.baseApiService.getStaticFile<IFaqResponse>(this.faqUrl);
  }
}
