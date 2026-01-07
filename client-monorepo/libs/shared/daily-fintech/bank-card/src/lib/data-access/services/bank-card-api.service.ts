import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { map, Observable } from 'rxjs';
import { BankCard, BnplToCard, CardApiResponse, UpdateCardApiResponse } from '../models/card-api.interface';
import { CardConfigResponse } from '../models/card-config-response.interface';
import { CardProfile, CardProfilePayload } from '../models/card-profile.interface';
import { CardZonesEnum } from '../models/card-zones.enum';
import { RegisterCardResponse } from '../models/register-card-response.interface';
import { RegisterCardDataInterface } from '../models/register-card-data.interface';
import { toPersianChar } from '@digipay/strings';
import { AllBanksResponseInterface } from '../models/all-banks-response.interface';
import { SearchCardsResponseInterface } from '../models/search-cards-response.interface';
import { BankClientResponse } from '../models/bank-client.response';
import { DynamicPasswordRequest } from '../models/dynamic-password-request';
import { DynamicPasswordResponse } from '../models/dynamic-password-response';
import { CardDetailResponseInterface } from '../models/card-detail-response.interface';

@Injectable({
  providedIn: 'root',
})
export class BankCardApiService {
  apiService = inject(ApiService);

  private transformCardOwnerToPersianChar(result: CardApiResponse) {
    result.cards = result.cards.map((card) => {
      card.cardOwner = card.cardOwner ? toPersianChar(card.cardOwner) : '';
      return card;
    });
    return result;
  }

  getAllBanks(): Observable<AllBanksResponseInterface> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'cards/banks');
    return this.apiService.call<AllBanksResponseInterface>(request);
  }

  getUserCards(): Observable<CardApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'cards?serviceType=0');
    return this.apiService.call<CardApiResponse>(request).pipe(map(this.transformCardOwnerToPersianChar));
  }

  getUserCardById(cardIndex: string): Observable<BankCard | null> {
    return new Observable<BankCard | null>((observer) => {
      this.getUserCards().subscribe({
        next: (cards) => {
          const target = cards.cards.find((card) => {
            return card.cardIndex === cardIndex;
          });
          if (target) {
            observer.next(target);
          } else {
            observer.next(null);
          }
          observer.complete();
        },
      });
    });
  }

  updateCardById(cardIndex: string, params: any): Observable<any> {
    params = {
      ...params,
      cardIndex,
    };
    const request = new RequestBuilder(RequestTypeEnum.PUT, `cards`, params);
    return this.apiService.call<any>(request);
  }

  getTargetCards(): Observable<CardApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'cards?type=target');
    return this.apiService.call<CardApiResponse>(request).pipe(map(this.transformCardOwnerToPersianChar));
  }

  getTargetCardById(cardIndex: string): Observable<BankCard | null> {
    return new Observable<BankCard | null>((observer) => {
      this.getTargetCards().subscribe({
        next: (cards) => {
          const target = cards.cards.find((card) => {
            return card.cardIndex === cardIndex;
          });
          if (target) {
            observer.next(target);
          } else {
            observer.next(null);
          }
          observer.complete();
        },
      });
    });
  }

  togglePin(bankName: string, cardIndex: string, pinned: boolean): Observable<UpdateCardApiResponse> {
    const payload = {
      cardIndex,
      pinned,
      alias: bankName,
    };
    const request = new RequestBuilder(RequestTypeEnum.PUT, 'cards', payload);
    return this.apiService.call<UpdateCardApiResponse>(request);
  }

  deleteCard(cardIndex: string): Observable<void> {
    const request = new RequestBuilder(RequestTypeEnum.DELETE, 'cards/' + cardIndex);
    return this.apiService.call<void>(request);
  }

  getC2cConfig(): Observable<CardConfigResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `cards/config`);
    return this.apiService.call<CardConfigResponse>(request);
  }

  getVaultCert(vaultName: string): Observable<string> {
    const request = new RequestBuilder(RequestTypeEnum.GET_TEXT, `certs/${vaultName}`);
    return this.apiService.call<string>(request);
  }

  getCardProfileCert(bankProfileCertName: string): Observable<string> {
    const request = new RequestBuilder(RequestTypeEnum.GET_TEXT, `certs/${bankProfileCertName}`);
    return this.apiService.call<string>(request);
  }

  getCardProfile(params: CardProfilePayload): Observable<CardProfile> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `cards/profile`, params);
    return this.apiService.call<CardProfile>(request).pipe(
      map((cardProfile) => {
        cardProfile.cardHolder = toPersianChar(cardProfile.cardHolder);
        return cardProfile;
      }),
    );
  }

  registerNewCard(params: RegisterCardDataInterface, cardZone: CardZonesEnum): Observable<RegisterCardResponse> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `cards/register?cardZone=${cardZone}`, params);
    return this.apiService.call<RegisterCardResponse>(request);
  }

  searchCards(queryParams = {}, params = {}): Observable<SearchCardsResponseInterface> {
    const qp = '?' + new URLSearchParams(queryParams).toString();
    const request = new RequestBuilder(RequestTypeEnum.POST, `payments/card/search${qp}`, params);
    return this.apiService.call<SearchCardsResponseInterface>(request);
  }

  getCertFileByUrl(certFileUrl: string): Observable<any> {
    const url = certFileUrl.split('/digipay/api/').pop();
    const request = new RequestBuilder(RequestTypeEnum.GET, `${url}`);
    request.patchOptions({ responseType: 'text' });
    return this.apiService.call<any>(request);
  }

  getBankClientConfig(bankCode: string): Observable<BankClientResponse> {
    const url = bankCode ? `banks/${bankCode}/client/9` : `banks/client/9`;
    const request = new RequestBuilder(RequestTypeEnum.GET, url);
    return this.apiService.call<BankClientResponse>(request);
  }

  getDpgBankClientConfig(): Observable<BankClientResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `banks/client/6`);
    return this.apiService.call<BankClientResponse>(request);
  }

  editCard(
    params: {
      cardIndex: string;
      alias: string;
      pinned: boolean;
      expireDate: string;
      callbackUrl: string;
    },
    cardZone?: CardZonesEnum,
  ): Observable<any> {
    const path = cardZone ? `cards?cardZone=${cardZone}` : 'cards';
    const request = new RequestBuilder(RequestTypeEnum.PUT, path, params);
    return this.apiService.call<any>(request);
  }

  getCardImage(id: string): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.GET_IMAGE, `files/${id}`);
    return this.apiService.call<any>(request);
  }

  requestDynamicPassword(params: DynamicPasswordRequest, ticket: string): Observable<DynamicPasswordResponse> {
    const header = { 'Content-Type': 'application/json', ticket: ticket };
    let request = new RequestBuilder(RequestTypeEnum.POST, 'cards/otp', params);
    request = request.setHeader(header);
    return this.apiService.call<DynamicPasswordResponse>(request);
  }

  attachCard(model: BnplToCard) {
    const header = { Agent: 'WEB' };
    let request = new RequestBuilder(RequestTypeEnum.POST, 'cards/services', model);
    request = request.setHeader(header);
    return this.apiService.call(request);
  }

  detachCard(model: BnplToCard) {
    const header = { Agent: 'WEB' };
    let request = new RequestBuilder(RequestTypeEnum.DELETE, 'cards/services', model);
    request = request.setHeader(header);
    return this.apiService.call(request);
  }

  getCardDetailApi(cardIndex: string): Observable<CardDetailResponseInterface> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `cards/detail?cardIndex=${cardIndex}`);
    return this.apiService.call<CardDetailResponseInterface>(request);
  }
}
