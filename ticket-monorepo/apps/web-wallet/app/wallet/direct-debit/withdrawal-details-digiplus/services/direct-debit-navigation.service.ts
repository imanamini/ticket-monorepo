import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DirectDebitNavigationService {

  constructor(private router: Router) {
  }

  public navigateToContract(ticket: string, queryParam?: Params): void {
    this.router.navigate(['/direct-debit/contract/' + ticket],
      (queryParam && {
        queryParams: {
          ...queryParam
        }
      })
    ).then();
  }

  public getParam(activatedRoute: ActivatedRoute, paramName: string): string {
    return activatedRoute.snapshot.paramMap.get(paramName);
  }

  public getQueryParam(activatedRoute: ActivatedRoute, queryParamName: string): string {
    return activatedRoute.snapshot.queryParamMap.get(queryParamName);
  }

  public navigateToCallback(): void {
    this.router.navigateByUrl('/direct-debit/callback').then();
  }

  public navigateToManagementPage(ticket: string): void {
    this.router.navigateByUrl('/direct-debit/management/' + ticket).then();
  }

  public navigateToDigiplusPage(ticket: string): void {
    this.router.navigateByUrl('/direct-debit/digiplus/' + ticket).then();
  }
}
