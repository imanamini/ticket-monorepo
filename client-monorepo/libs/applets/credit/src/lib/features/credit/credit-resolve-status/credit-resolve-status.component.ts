import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../data-access/utils/url';
import { CreditApiService } from '../data-access/services/credit-api.service';
import { VolunteerStateResponse } from '../data-access/models/credit/volunteer/volunteer-state.response';
import { VOLUNTEER_STATES } from '../data-access/models/credit/volunteer/volunteer-state.enum';
import { WalletCardService } from '../data-access/services/wallet-card.service';
import { Subscription } from 'rxjs';
import { CreditNavigationService } from '../data-access/services/credit-navigation.service';
import { CreditServiceTypeService } from '../data-access/services/credit-service-type.service';
import { CreditPageLoadingComponent } from '../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../components/credit-app-bar/credit-app-bar.component';
import { CreditUserService } from '../data-access/services/credit-user.service';

@Component({
  selector: 'app-credit-resolve-status',
  templateUrl: './credit-resolve-status.component.html',
  styleUrls: ['./credit-resolve-status.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditResolveStatusComponent implements OnInit, OnDestroy {
  title = signal<string | null>(null);
  fromDK = false;
  private getWalletSubscription!: Subscription;
  private queryParams: any = {};

  private router = inject(Router);
  private creditService = inject(CreditApiService);
  private creditNavigationService = inject(CreditNavigationService);
  private creditUrlService = inject(CreditUrlService);
  private walletCardService = inject(WalletCardService);
  private creditServiceTypeService = inject(CreditServiceTypeService);
  private activatedRoute = inject(ActivatedRoute);
  private creditUserService = inject(CreditUserService);

  ngOnInit() {
    this.creditUserService.clearLoggedInUser();
    this.title.set(this.creditServiceTypeService.giveResultByType('وام‌ها', 'اعتبار اقساطی'));

    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = { ...params };
      if (params['prevent'] === 'back') {
        window.history.pushState({}, '', this.router.url);
      }
      if (params['utm_source'] === 'digikala') {
        this.fromDK = true;
      }

      this.getWalletSubscription = this.walletCardService.getRawWalletList(true).subscribe(({ wallets, volunteers }) => {
        if (wallets.length > 0 || volunteers.length > 0) {
          if (this.fromDK) {
            if (this.creditServiceTypeService.isBnpl()) {
              this.navigateWithParams('/overview', {
                utm_medium: 'banner',
                utm_source: 'digikala',
                utm_campaign: 'circle_badge',
                utm_content: 'bnpl',
              });
            } else {
              this.navigateWithParams('/overview', {
                utm_medium: 'banner',
                utm_source: 'digikala',
                utm_campaign: 'dk',
                utm_content: 'credit',
                utm_term: 'pdpbanner',
              });
            }
          } else {
            this.navigateWithParams('/overview');
          }
        } else {
          if (this.fromDK) {
            if (this.creditServiceTypeService.isBnpl()) {
              this.navigateWithParams('/select-plan', {
                utm_medium: 'banner',
                utm_source: 'digikala',
                utm_campaign: 'circle_badge',
                utm_content: 'bnpl',
              });
              return;
            } else {
              this.navigateWithParams('/pre-register', {
                utm_medium: 'banner',
                utm_source: 'digikala',
                utm_campaign: 'dk',
                utm_content: 'credit',
                utm_term: 'pdp0526',
              });
              return;
            }
          }
          // CALL API AND DECIDE ABOUT DESTINATION PAGE BASED ON THE STATUS
          this.creditService.getVolunteerState().subscribe((r) => {
            this.handleState(r);
          });
        }
      });
    });
  }

  navigateWithParams(path: string, additionalParams: any = {}) {
    const mergedParams = { ...this.queryParams, ...additionalParams };
    const queryString = Object.entries(mergedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    const fullPath = `${path}${queryString ? '?' + queryString : ''}`;
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(fullPath), { replaceUrl: true });
  }

  handleState(response: VolunteerStateResponse) {
    switch (response.state) {
      case VOLUNTEER_STATES.ON_BOARDING:
        if (this.creditServiceTypeService.isBnpl()) {
          this.navigateWithParams('/onboarding');
        }
        if (this.creditServiceTypeService.isCredit()) {
          this.navigateWithParams('/pre-register');
        }
        break;
      case VOLUNTEER_STATES.PREREGISTERED:
        // For this special case with state data
        const fullPath = '/volunteer/view';
        const queryString = Object.entries(this.queryParams)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');

        this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(fullPath) + (queryString ? '?' + queryString : ''), {
          replaceUrl: true,
          state: {
            showVolunteer: true,
            pageFileId: response.resultUrl,
          },
        });
        break;
      case VOLUNTEER_STATES.PREREGISTERING:
        if (this.fromDK) {
          if (this.creditServiceTypeService.isBnpl()) {
            this.navigateWithParams('/select-plan', {
              utm_medium: 'banner',
              utm_source: 'digikala',
              utm_campaign: 'circle_badge',
              utm_content: 'bnpl',
            });
          } else {
            this.navigateWithParams('/pre-register', {
              utm_medium: 'banner',
              utm_source: 'digikala',
              utm_campaign: 'dk',
              utm_content: 'credit',
              utm_term: 'pdp0526',
            });
          }
        } else {
          if (this.creditServiceTypeService.isBnpl()) {
            this.navigateWithParams('/select-plan');
          } else {
            this.navigateWithParams('/pre-register');
          }
        }
        break;
    }
  }

  ngOnDestroy(): void {
    if (this.getWalletSubscription) {
      this.getWalletSubscription.unsubscribe();
    }
  }

  closeService() {
    this.creditNavigationService.closeService();
  }
}
