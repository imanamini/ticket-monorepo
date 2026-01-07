import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../../data-access/services/base-api.service';
import { SERVICE_TYPE } from '../../data-access/models/credit/service-type/service-type.model';
import { GetInstallmentsOverviewResponse } from '../data-access/get-installments-overview-response';
import { WalletsResponse } from '../../data-access/models/credit/wallet/wallets-response.model';
import { InstallmentRefererShortKey } from '../../data-access/models/credit/installment/installment-referer.model';
import { InstallmentsOverviewRefererService } from './installments-overview-referer.service';

@Injectable()
export class InstallmentsOverviewApiService {
  private api = inject(BaseApiService);
  private refererService = inject(InstallmentsOverviewRefererService);

  getInstallmentsOverview(serviceType: SERVICE_TYPE, referer: string | null): Observable<GetInstallmentsOverviewResponse> {
    const enrichedReferer = this.refererService.enrichReferer(referer);
    const queryParam = enrichedReferer ? `&${InstallmentRefererShortKey}=${enrichedReferer}` : '';
    return this.api.get(`contracts/installments?serviceType=${serviceType}${queryParam}`);
  }

  hasActiveBnpl(): Observable<boolean> {
    return this.api.get('credit/wallet-cards').pipe(
      map((response: WalletsResponse) => {
        return response.creditWallets.some((wallet) => wallet.serviceType === SERVICE_TYPE.BNPL);
      }),
    );
  }

  hasActiveCredit(): Observable<boolean> {
    return this.api.get('credit/wallet-cards').pipe(
      map((response: WalletsResponse) => {
        return response.creditWallets.some((wallet) => wallet.serviceType === SERVICE_TYPE.CREDIT);
      }),
    );
  }
}
