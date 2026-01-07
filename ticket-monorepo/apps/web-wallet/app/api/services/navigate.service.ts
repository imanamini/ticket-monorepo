import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RedirectFormData } from '../../core/services/redirect.service';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {

  constructor(
    private router: Router
  ) {
  }

  public toCallback(redirectData: RedirectFormData[] = []): void {
    const queryParams = {};
    redirectData.forEach(item => {
      queryParams[item.key] = item.value;
    });

    this.router.navigate(['/direct-debit/callback'], {
      queryParams
    }).then();
  }
}
