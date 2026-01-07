import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {PageEnum} from '../enums/page.enum';
import {UpgFeatureName} from '../../../api/emuns/upg-feature-name.emun';
import {FlagEnum} from '../enums/flag.enum';

@Injectable()
export class UrlService {
  private router = inject(Router);

  public navigateToInternalUrlByUrl(url: string, param?: any): void {
    if (param) {
      this.router.navigateByUrl(url, {...param}).then();
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
    this.router.navigate([], {
      queryParams:
        {page},
      queryParamsHandling: 'merge',
      skipLocationChange: false
    }).then();
  }

  public addMethodQueryParam(method: UpgFeatureName): void {
    this.router.navigate([], {
      queryParams:
        {method: UpgFeatureName[method] || 'UNDEFINED'},
      queryParamsHandling: 'merge',
      skipLocationChange: false
    }).then();
  }

  public addFlagQueryParam(flag: FlagEnum): void {
    this.router.navigate([], {
      queryParams:
        {flag: FlagEnum[flag]},
      queryParamsHandling: 'merge',
      skipLocationChange: false
    }).then();
  }

  public removeDataQueryParam(): void {
    this.router.navigate([], {
      queryParams:
        {data: null},
      queryParamsHandling: 'merge',
      skipLocationChange: false
    }).then();
  }
}
