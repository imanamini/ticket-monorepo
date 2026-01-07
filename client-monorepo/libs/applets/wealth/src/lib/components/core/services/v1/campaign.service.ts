import { Observable, catchError, of } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { TServiceResult } from '../../../../data-access/models/base/t-service-resutl';
import { CAMPAIGN_BANNER_API, CAMPAIGN_PROCESS_API } from '../../../../data-access/constants/api';
import { TreasureHuntCampaignProcess } from '../../../../data-access/models/treasure-hunt.model';
import { ICampaignProcess } from '../../../../features/campaign/models/campaign-process.interface';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private baseApiService = inject(BaseApiService);

  getCampaigns(): Observable<TServiceResult<{ campaigns: TreasureHuntCampaignProcess[] }>> {
    return this.baseApiService.get(CAMPAIGN_BANNER_API).pipe(
      catchError((err) => {
        return of(new TServiceResult<boolean>(false, err.message, err.error, false));
      }),
    );
  }

  getCampaignProcess(code: string, payload?: string, parameters?: any): Observable<TServiceResult<ICampaignProcess>> {
    let url = CAMPAIGN_PROCESS_API + '?campaignCode=' + code;
    if (payload) url += '&' + payload;
    return this.baseApiService.post(url, parameters).pipe(
      catchError((err) => {
        return of(new TServiceResult<boolean>(false, err.message, err.error, false));
      }),
    );
  }
}
