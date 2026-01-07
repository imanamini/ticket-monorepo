import { Component, inject, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { SubscriptionApiService } from './data-access/services/subscription-api.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SUBSCRIPTION_QUERY_PARAMS } from './data-access/constants/subscription-query-params';
import { SubscriptionState } from './data-access/enums/subscription-state.enum';
import { SUBSCRIPTION_URLS } from './data-access/constants/subscription-urls';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { UiButtonComponent } from '../../components/ui-button/ui-button/ui-button.component';
import { tap } from 'rxjs';

@Component({
  selector: 'subscription',
  standalone: true,
  imports: [
    NgxSpinnerModule,
    RouterOutlet,
    UiButtonComponent
  ],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent implements OnInit {

  isLoading = signal<boolean>(true);
  showError = signal<boolean>(false);

  private subscriptionApiService = inject(SubscriptionApiService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);

  ngOnInit(): void {
    this.getPolicyState();
  }

  getPolicyState(): void {
    this.isLoading.set(false);
    const policyKey = this.activatedRoute.snapshot.queryParams[SUBSCRIPTION_QUERY_PARAMS.POLICY_KEY];
    if (policyKey) {
      this.subscriptionApiService.getPolicyInfo(policyKey)
        .pipe(tap(() => this.showError.set(false)))
        .subscribe({
          next: response => {
            this.handleState(response.data.currentState);
            this.isLoading.set(false);
          }, error: () => {
            this.isLoading.set(false);
            this.showError.set(true);
          }
        });
    } else {
      this.isLoading.set(false);
      this.showError.set(true);
    }
  }

  handleState(state: SubscriptionState): void {
    let route: string;
    switch (state) {
      case SubscriptionState.Paid:
        route = SUBSCRIPTION_URLS.COMPLETE_INFO;
        break;
      case SubscriptionState.OfflineSerialComplete:
        route = SUBSCRIPTION_URLS.UPLOAD_IMAGES;
        break;
      case SubscriptionState.OfflineImageUploaded:
        route = SUBSCRIPTION_URLS.HEALTH_CHECK;
        break;
      case SubscriptionState.Activated:
      case SubscriptionState.Freezed:
        route = SUBSCRIPTION_URLS.COMPLETE_JOURNEY;
        break;
    }
    this.router.navigate([route], {queryParamsHandling: 'preserve', skipLocationChange: true});
  }

  public goToBack(): void {
    this.location.back();
  }
}
