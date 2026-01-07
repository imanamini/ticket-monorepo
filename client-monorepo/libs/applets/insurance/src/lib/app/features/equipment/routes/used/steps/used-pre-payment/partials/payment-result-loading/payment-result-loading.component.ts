import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UsedCallbackModel } from './models/used-callback.model';
import { UsedApiService } from '../../../../../../api/services/used/used-api.service';

@Component({
  selector: 'payment-result-loading',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    UiLoadingSpinnerComponent
  ],
  templateUrl: './payment-result-loading.component.html',
  styleUrl: './payment-result-loading.component.scss'
})
export class PaymentResultLoadingComponent implements OnInit, OnDestroy {

  subscriptions: Subscription = new Subscription();
  params: Params;

  constructor(private route: ActivatedRoute,
              private usedApiService: UsedApiService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.params = this.route.snapshot.queryParams;
    this.usedCallback();
  }

  usedCallback(): void {
    const body: UsedCallbackModel = {
      trackingCode: this.params.trackingCode,
      providerId: this.params.providerId,
      amount: this.params.amount,
      result: this.params.result,
    };

    const subscription = this.usedApiService.usedCallback(body).subscribe();
    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
