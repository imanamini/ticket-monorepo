import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseApiService } from '../data-access/services/base-api.service';
import { NgxPaymentResult } from '@digipay/ngx-payment-result';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';
import { CreditPaymentResultService } from '../data-access/services/credit-payment-result.service';
import { CreditPageLoadingComponent } from '../components/credit-page-loading/credit-page-loading.component';
import { CreditScrollableViewComponent } from '../components/credit-scrollable-view/credit-scrollable-view.component';

@Component({
  selector: 'app-credit-transaction-detail',
  templateUrl: './credit-transaction-detail.component.html',
  standalone: true,
  styleUrls: ['./credit-transaction-detail.component.scss'],
  imports: [NgxPaymentResult, CreditPageLoadingComponent, CreditScrollableViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditTransactionDetailComponent implements OnInit {
  receipt = signal<PaymentResult | null>(null);
  isLoading = signal(true);
  trackingCode = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: BaseApiService,
  ) {}

  ngOnInit(): void {
    const trackingCode = this.route.snapshot.params['trackingCode'];
    if (!trackingCode) {
      this.router.navigateByUrl('/');
    } else {
      this.trackingCode.set(trackingCode);
      this.apiService.get(`activities/${trackingCode}`).subscribe((result) => {
        this.receipt.set(CreditPaymentResultService.getFixedData(result));
        this.isLoading.set(false);
      });
    }
  }

  backButtonClick() {
    window.history.back();
  }
}
