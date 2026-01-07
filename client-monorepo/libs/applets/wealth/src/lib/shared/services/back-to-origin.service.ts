import { inject, Injectable } from '@angular/core';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { checkWealthOrigin } from '../../components/utils/check-wealth-origin';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BackToOriginService {
  router = inject(Router);
  hybridService = inject(NgxHybridServiceService);

  goBackToOrigin() {
    if (this.hybridService.isHybrid()) {
      this.router.navigate(['']).then();
    } else {
      if (checkWealthOrigin() === 'localhost' || checkWealthOrigin() === 'wealth') {
        this.router.navigateByUrl('/hub').then();
      } else {
        const redirectUrl = localStorage.getItem('redirectUrl');
        // ? just for development
        if (window.location.origin.includes('localhost')) return;
        if (redirectUrl?.includes('app.mydigipay.') || redirectUrl?.includes('express.mydigipay.')) {
          this.router.navigateByUrl('/hub').then();
        } else {
          this.router.navigateByUrl('/hub').then();
        }
      }
    }
  }
}
