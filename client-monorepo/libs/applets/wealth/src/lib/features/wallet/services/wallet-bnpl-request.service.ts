import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../../../components/core/services/base-api.service';
import { WALLET_COORDINATOR_PROCESS_API } from '../../../data-access/constants/api';
import { catchError, map, Observable, of } from 'rxjs';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { IProcessData, IWalletProcessData } from '../models/wallet-process.interface';
import { IWalletProcess } from '../models/wallet-cashin-model.interface';
import { EWalletPage } from '../models/wallet-page-names.enum';
import { WALLET_BNPL_REQUEST_FAILURE_ROUTE } from '../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { ProcessActionType } from '../models/process-action.type';

@Injectable({
  providedIn: 'root',
})
export class WalletBnplRequestService {
  private baseService = inject(BaseApiService);
  private navigationService = inject(WealthNavigationService);

  // process(apiUrl: string, processData: IWalletProcess): Observable<TServiceResult<IWalletProcessData>> {
  //   return this.baseService
  //     .post(WALLET_COORDINATOR_PROCESS_API, {
  //       walletName,
  //       action,
  //     })
  //     .pipe(
  //       map((res: TServiceResult<IWalletProcessData>) => {
  //         if (res.result.action.toLowerCase() === 'page') {
  //           this._handleWalletPageRedirection(res.result.data.pageName, { ...processData, ...res.result.data }, processData.walletId);
  //         } else if (res.result.action.toLowerCase() === 'bottomsheet') {
  //           this._handleWalletPageRedirection(res.result.data.topOnPage, { ...processData, ...res.result.data }, processData.walletId);
  //         } else if (res.result.action.toLowerCase() === 'exceptionpage') {
  //           this._handleWalletPageRedirection(res.result.data.topOnPage, { ...processData, ...res.result.data }, processData.walletId);
  //         }
  //         return res;
  //       }),
  //       catchError((error) => {
  //         return of(error);
  //       }),
  //     );
  // }

  oldProcess(walletName: string, action: ProcessActionType, processData: IWalletProcess): Observable<TServiceResult<IWalletProcessData>> {
    return this.baseService
      .post(WALLET_COORDINATOR_PROCESS_API, {
        walletName,
        action,
      })
      .pipe(
        map((res: TServiceResult<IWalletProcessData>) => {
          if (res.result.action.toLowerCase() === 'page') {
            this._handleWalletPageRedirection(res.result.data.pageName, { ...processData, ...res.result.data }, processData.walletId);
          } else if (res.result.action.toLowerCase() === 'bottomsheet') {
            this._handleWalletPageRedirection(res.result.data.topOnPage, { ...processData, ...res.result.data }, processData.walletId);
          } else if (res.result.action.toLowerCase() === 'exceptionpage') {
            this._handleWalletPageRedirection(res.result.data.topOnPage, { ...processData, ...res.result.data }, processData.walletId);
          }
          return res;
        }),
        catchError((error) => {
          return of(error);
        }),
      );
  }

  private _handleWalletPageRedirection(page: string, state: IProcessData, walletId: string) {
    if (state.url) {
      window.open(state.url, '_self');
    } else {
      switch (page) {
        case EWalletPage.page_bnpl_deposit_scoring_fail:
          this.navigationService.navigate([WALLET_BNPL_REQUEST_FAILURE_ROUTE, walletId], {
            state,
          });
          break;
      }
    }
  }
}
