import { Component, inject, OnInit, signal } from '@angular/core';
import { ExportInsuranceComponent } from '../../components/export-insurance/export-insurance.component';
import { SubscriptionApiService } from '../../data-access/services/subscription-api.service';
import { BaseComponent } from '../../../../components/base/base.component';
import { SUBSCRIPTION_QUERY_PARAMS } from '../../data-access/constants/subscription-query-params';
import { SubscriptionModel } from '../../data-access/model/subscription.model';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'complete-journey',
  standalone: true,
  imports: [
    ExportInsuranceComponent,
    NgxSpinnerModule
  ],
  templateUrl: './complete-journey.component.html',
  styleUrl: './complete-journey.component.scss'
})
export class CompleteJourneyComponent extends BaseComponent implements OnInit {
  private subscriptionApiService = inject(SubscriptionApiService);
  subscriptionInfo = signal<SubscriptionModel>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    const orderCode = this.activatedRoute.snapshot.queryParams[SUBSCRIPTION_QUERY_PARAMS.POLICY_KEY];
    if (!orderCode) {
      return;
    }
    this.subscriptionApiService.getPolicyInfo(orderCode).subscribe({
      next: response => {
        this.isLoading.set(false);
        this.subscriptionInfo.set(response.data);
      }
    });
  }

}
