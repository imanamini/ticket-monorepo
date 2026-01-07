import { Injectable } from '@angular/core';
import { BrowserPlatformLocation } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { JourneyType, QueryParamKeysEnum } from '../../features/home/query-param-keys.enum';
import { ReferrerEnum } from '../enums/referrer.enum';

@Injectable({
  providedIn: 'root'
})
export class ReferrerService {
  public static readonly referrerSourceDpxItems = [ReferrerEnum.SUPER_APP, ReferrerEnum.DPX_APP, ReferrerEnum.DPX];
  public static readonly referrerSourceWebsite = ReferrerEnum.WEBSITE;

  public get referrer(): string {
    return this.referrerSource;
  }

  public get utmSource(): Record<string, string> {
    return this.utmSourceKey;
  }

  public get entryFunnelSource(): JourneyType {
    return this.entryFunnel ?? window.sessionStorage.getItem(QueryParamKeysEnum.JourneyType) as JourneyType;
  }

  public set entryFunnelSource(journeyType: JourneyType) {
    window.sessionStorage.setItem(QueryParamKeysEnum.JourneyType, journeyType);
    this.entryFunnel = journeyType;
  }

  private entryFunnel: JourneyType;
  private referrerSource: string;
  private utmSourceKey: Record<string, string>;

  constructor(private location: BrowserPlatformLocation,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  public setReferrerSourceFromUrl(): void {
    const queryParams = new URLSearchParams(this.location.search);
    this.entryFunnel = queryParams?.get(QueryParamKeysEnum.JourneyType) as JourneyType ?? 'noSanhab';
    this.referrerSource = this.extractReferrer(queryParams);
    this.utmSourceKey = this.getQueryParamsByPrefix();
  }

  public setReferrerSource(referrer: string, utmSource?: Record<string, string>): void {
    const queryParams = new HttpParams();
    if (referrer) {
      queryParams.set(QueryParamKeysEnum.Referrer, referrer);
      this.referrerSource = referrer;
    }
    if (utmSource) {
      for (const key of Object.keys(utmSource)) {
        queryParams.set(key, utmSource[key]);
      }
      this.utmSourceKey = utmSource;
    }
    if (queryParams.keys().length) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge',
      });
    }
  }

  private getQueryParamsByPrefix(): Record<string, string> {
    const filteredParams: Record<string, string> = {};
    new URLSearchParams(this.location.search).forEach((value, key) => {
      if (key.startsWith('utm_')) {
        filteredParams[key] = value;
      }
    });
    return filteredParams;
  }

  private extractReferrer(queryParams: URLSearchParams): string {
    return queryParams.get(QueryParamKeysEnum.Referrer);
  }
}
