import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { HttpClient } from '@angular/common/http';
import { PerformanceTierService } from './performance-tier.service';

@Injectable({
  providedIn: 'root',
})
export class InitiatorService {
  initialized = signal(false);
  bottomSheetService = inject(NgxBottomSheetService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  mainRoute = 'hub';
  http = inject(HttpClient);
  performanceTierService = inject(PerformanceTierService);

  initiate(): void {
    this.checkShouldNavigateToCredit();
    this.checkPerformanceTier();
  }

  checkPerformanceTier(): void {
    const tier = this.performanceTierService.tier();
    if (tier === 'low') {
      document.body.classList.add('low-performance');
    }
  }

  private checkShouldNavigateToCredit(): void {
    const rt = this.activatedRoute.snapshot.queryParams['rt'];
    if (rt) {
      this.router.navigateByUrl(decodeURIComponent(this.router.url.replace(this.mainRoute + '?rt=', '')));
    } else {
      this.initialized.set(true);
    }
  }
}
