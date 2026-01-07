import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { ReferrerService } from './referrer.service';

@Injectable({
  providedIn: 'root'
})
export class DpxService {

  private hybridService = inject(NgxHybridServiceService);
  private referrerService = inject(ReferrerService);
  private router = inject(Router);

  get IsEnteredFromDpx(): boolean {
    return this.hybridService.isHybrid() || ReferrerService.referrerSourceDpxItems.some(source => source === this.referrerService.referrer);
  }

  get IsEnteredFromWebsite(): boolean {
    return ReferrerService.referrerSourceWebsite === this.referrerService.referrer;
  }

  public goToDpxHome(): void {
      this.router.navigate(['/hub']);
  }
}
