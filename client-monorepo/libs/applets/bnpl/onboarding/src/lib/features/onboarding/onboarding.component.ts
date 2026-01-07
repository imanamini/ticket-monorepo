import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BNPL_ONBOARDING_FEATURES } from '../../data-access/constants/bnpl-onboarding.constant';
import { BnplOnboardingFeature } from '../../data-access/models/bnpl-onboarding.model';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import {
  CreditNavigationService,
  CreditScrollableViewComponent,
  CreditUrlService,
  STORE_PROVIDERS,
  StoresDataService,
} from '@client-monorepo/applets/credit';
import { ApiImageModule, ApiImageService } from '@digipay/ng-ui-api-image';

@Component({
  selector: 'bnpl-onboarding-onboarding',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxIcon, CreditScrollableViewComponent, ApiImageModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingComponent implements OnInit {
  private router = inject(Router);
  private storesDataService = inject(StoresDataService);
  apiImageService = inject(ApiImageService);
  creditNavigationService = inject(CreditNavigationService);
  creditUrlService = inject(CreditUrlService);

  features = signal<BnplOnboardingFeature[]>(BNPL_ONBOARDING_FEATURES);
  stores = signal<any[]>([]);
  page = 0;
  pageSize = 14;

  ngOnInit() {
    this.showStores();
    this.apiImageService.prefixUrl = 'https://uatsite.mydigipay.info/bck-assets/cached-images';
  }

  async showStores() {
    this.setFilterStore();
    const stores = await this.storesDataService.getStoresListWithoutLogin(this.page, this.pageSize);
    this.stores.set(stores);
  }

  setFilterStore() {
    this.storesDataService.setSelectedProvider(STORE_PROVIDERS.BNPL);
  }

  onStartActivation(): void {
    // Navigate to activation flow or next step
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/select-plan')).then();
  }

  onClose(): void {
    // Navigate back or close the onboarding
    this.creditNavigationService.closeService();
  }
}
