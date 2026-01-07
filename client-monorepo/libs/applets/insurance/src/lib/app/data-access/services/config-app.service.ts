import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { GeneralResponse } from '../../features/equipment/api/models/api-result.model';
import { map } from 'rxjs/operators';
import {
  ConfigResponseModel,
  ConfigurationContractModel,
  NavigationConfigModel
} from '../../features/auth/models/config.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})

export class ConfigAppService extends ApiService {
  getCacheConfig: any;
  dataGotten = false;
  CDNUrl = '';
  navigations = new BehaviorSubject<NavigationConfigModel[]>(null);

  claimCancelReasons = new BehaviorSubject<ConfigurationContractModel[]>([]);
  policyCancelReasons = new BehaviorSubject<ConfigurationContractModel[]>([]);
  policyCategories = new BehaviorSubject<ConfigurationContractModel[]>([]);
  policyStatesMapper = new BehaviorSubject<{}>({});
  claimStatesMapper = new BehaviorSubject<{}>({});
  rolesMapper = new BehaviorSubject<{}>({});
  saleChannelMapper = new BehaviorSubject<{}>({});
  userId = new BehaviorSubject<string>(null);
  purchaseStatesMapper = new BehaviorSubject<{}>({});
  businesses = new BehaviorSubject<ConfigurationContractModel[]>([]);

  constructor(
    httpClient: HttpClient,
  ) {
    super(httpClient);
  }

  getConfig(): Observable<GeneralResponse<ConfigResponseModel>> {
    return (this.getCacheConfig ? of(this.getCacheConfig) : this.get('/insurance/core/configuration')
      .pipe(
        tap(z => this.getCacheConfig = z),
        map((res: GeneralResponse<ConfigResponseModel>) => {
          const policyStatesMapper = {};
          const claimStatesMapper = {};
          const purchaseStatesMapper = {};
          const saleChannelMapper = {};
          const rolesMapper = {};
          /* 1) mapping to key value pair*/
          res.data?.policyStates.map(policyStatus => policyStatesMapper[policyStatus.identifier] = {...policyStatus});
          res.data?.claimStates.map(claimStates => claimStatesMapper[claimStates.identifier] = {...claimStates});
          res.data?.purchaseStates.map(purchaseStates => purchaseStatesMapper[purchaseStates.identifier] = {...purchaseStates});
          res.data?.saleChannels.map(saleChannels => saleChannelMapper[saleChannels.identifier] = {...saleChannels});
          res.data?.roles.map(role => rolesMapper[role.roleName] = {...role});
          /* 2) fill subjects to use in project*/
          this.claimStatesMapper.next(claimStatesMapper);
          this.policyStatesMapper.next(policyStatesMapper);
          this.purchaseStatesMapper.next(purchaseStatesMapper);
          this.saleChannelMapper.next(saleChannelMapper);
          this.rolesMapper.next(rolesMapper);
          return res;
        }),
        tap((response: GeneralResponse<ConfigResponseModel>) => {
          this.dataGotten = true;
          this.CDNUrl = response.data.cdnUrl;
          this.navigations.next(response.data.navigations);
          this.claimCancelReasons.next(response.data.claimCancelReasons);
          this.policyCancelReasons.next(response.data.policyCancelReasons);
          this.policyCategories.next(response.data.categories);
          this.userId.next(response.data.userId);
          this.businesses.next(response.data.businesses);
        })));
  }

  clear(): void {
    this.dataGotten = false;
    this.claimCancelReasons.next(null);
    this.policyCancelReasons.next(null);
    this.policyCategories.next(null);
    this.policyStatesMapper.next(null);
    this.claimStatesMapper.next(null);
    this.rolesMapper.next(null);
    this.userId.next(null);
    this.purchaseStatesMapper.next(null);
    this.businesses.next(null);
  }
}
