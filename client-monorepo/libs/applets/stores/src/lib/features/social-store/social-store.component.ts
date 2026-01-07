import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { Store, StoreRestrictionFields, StoresApiService } from '@client-monorepo/stores';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialCtaComponent } from '../../components/social-cta/social-cta.component';
import { SocialCtaConfigModel } from '../../data-access/models/social-cta-config.model';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { SummarizeThousandsPipe } from '@client-monorepo/pipes';
import { SocialPostsGridComponent } from '@client-monorepo/social';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'stores-applet-social-store',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, ApiImageModule, SocialPostsGridComponent, SocialCtaComponent, SummarizeThousandsPipe, NgxButtonComponent],
  templateUrl: './social-store.component.html',
  styleUrl: './social-store.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialStoreComponent implements OnInit, OnDestroy {
  // Injections
  private router = inject(Router);
  backHandler = inject(BackHandlerService);
  storeApi = inject(StoresApiService);
  activatedRoute = inject(ActivatedRoute);
  bottomNavService = inject(NgxBottomNavigationService);

  // Variables
  trackingCode = signal<string>('');
  store = signal<Store | undefined>(undefined);
  instagramUserName = computed(() => this.store()?.instagram?.username ?? undefined);
  description = computed<string | undefined>(() => this.store()?.description ?? undefined);
  ctaConfig = computed<SocialCtaConfigModel>(() => {
    const store = this.store();
    return {
      instagramUrl: 'https://instagram.com/' + store?.instagram?.username,
      whatsappNumber: store?.whatsApp?.cellphone,
      storeTrackingCode: store?.trackingCode,
      referrer: 'PROFILE'
    };
  });

  constructor() {
    effect(() => {
      if (this.trackingCode() !== '') {
        this.getStore();
      }
    });
  }

  ngOnInit() {
    this.bottomNavService.hide();
    this.getTrackingCode();
  }

  getTrackingCode(): void {
    this.trackingCode.set(decodeURI(this.activatedRoute.snapshot.paramMap.get('trackingCode') as string));
  }

  getStore(): void {
    this.storeApi.getStore(this.trackingCode()!, StoreRestrictionFields.TRACKING_CODE).subscribe({
      next: (store) => {
        if (store) {
          this.store.set(store);
        }
      }
    });
  }

  goBack(): void {
    this.backHandler.goBack();
  }

  goToViolationReport(): void {
    this.router.navigate(['stores', 'violation'], { queryParams: { trackingCode: this.store()?.trackingCode } });
  }

  ngOnDestroy(): void {
    this.bottomNavService.show();
  }
}
