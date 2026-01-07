import { inject, Injectable } from '@angular/core';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { DIRECT_DEBIT_ENDPOINT } from './direct-debit.endpoint';
import {
  DirectDebitBankResponse,
  DirectDebitContractCreateResponse,
  DirectDebitContractResponse,
  DirectDebitContractStatusChange,
  DirectDebitCreateContract,
  DirectDebitValidateContract,
} from '../model/direct-debit.model';
import { TransactionSearchPayloadInterface } from '@client-monorepo/payment/transactions';

@Injectable()
export class DirectDebitApiService {
  private apiService = inject(ApiService);

  public validate(model: DirectDebitValidateContract): Observable<ApiResultInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, DIRECT_DEBIT_ENDPOINT.validateContract, model);
    return this.apiService.call<ApiResultInterface>(request);
  }

  public create(model: DirectDebitCreateContract): Observable<DirectDebitContractCreateResponse> {
    const request = new RequestBuilder(RequestTypeEnum.POST, DIRECT_DEBIT_ENDPOINT.register, model);
    return this.apiService.call<DirectDebitContractCreateResponse>(request);
  }

  public getContractList(): Observable<DirectDebitContractResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, DIRECT_DEBIT_ENDPOINT.contracts);
    return this.apiService.call<DirectDebitContractResponse>(request);
  }

  public getContractSearch(model: TransactionSearchPayloadInterface): Observable<DirectDebitContractResponse> {
    const request = new RequestBuilder(RequestTypeEnum.POST, DIRECT_DEBIT_ENDPOINT.search, model);
    request.setParams({ size: model.size });
    return this.apiService.call<DirectDebitContractResponse>(request);
  }

  public banksList(): Observable<DirectDebitBankResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, DIRECT_DEBIT_ENDPOINT.banks);
    return this.apiService.call<DirectDebitBankResponse>(request);
  }

  public activateContract(model: DirectDebitContractStatusChange): Observable<ApiResultInterface> {
    const { contractId } = model;
    const request = new RequestBuilder(RequestTypeEnum.POST, DIRECT_DEBIT_ENDPOINT.activate(contractId));
    return this.apiService.call<ApiResultInterface>(request);
  }

  public deactivateContract(model: DirectDebitContractStatusChange): Observable<ApiResultInterface> {
    const { contractId } = model;
    const request = new RequestBuilder(RequestTypeEnum.POST, DIRECT_DEBIT_ENDPOINT.deactivate(contractId));
    return this.apiService.call<ApiResultInterface>(request);
  }

  public cancelContract(model: DirectDebitContractStatusChange): Observable<ApiResultInterface> {
    const { contractId } = model;
    const request = new RequestBuilder(RequestTypeEnum.POST, DIRECT_DEBIT_ENDPOINT.cancel(contractId));
    return this.apiService.call<ApiResultInterface>(request);
  }
}
