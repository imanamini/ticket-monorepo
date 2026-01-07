import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PageEnum } from '../models/page.enum';
import { FlagEnum } from '../models/flag.enum';
import { APP_ACTIONS } from '@client-monorepo/common/action-handler';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private router = inject(Router);

  public navigateToInternalUrlByUrl(url: string, param?: any): void {
    if (param) {
      this.router.navigateByUrl(url, { ...param }).then();
    } else {
      this.router.navigateByUrl(url).then();
    }
  }

  public navigateToInternalUrl(url: string, param?: any): void {
    if (param) {
      this.router.navigate([url, param]).then();
    } else {
      this.router.navigate([url]).then();
    }
  }

  public addPageToQueryParam(page: PageEnum): void {
    this.router
      .navigate([], {
        queryParams: { page },
        queryParamsHandling: 'merge',
        skipLocationChange: false,
        replaceUrl: true,
      })
      .then();
  }

  public addMethodQueryParam(method: any): void {
    this.router
      .navigate([], {
        queryParams: { method: APP_ACTIONS[method] || 'UNDEFINED' },
        queryParamsHandling: 'merge',
        skipLocationChange: false,
        replaceUrl: true,
      })
      .then();
  }

  public addFlagQueryParam(flag: FlagEnum): void {
    this.router
      .navigate([], {
        queryParams: { flag: FlagEnum[flag] },
        queryParamsHandling: 'merge',
        skipLocationChange: false,
        replaceUrl: true,
      })
      .then();
  }

  public removeDataQueryParam(): void {
    this.router
      .navigate([], {
        queryParams: { data: null },
        queryParamsHandling: 'merge',
        skipLocationChange: false,
        replaceUrl: true,
      })
      .then();
  }
}
