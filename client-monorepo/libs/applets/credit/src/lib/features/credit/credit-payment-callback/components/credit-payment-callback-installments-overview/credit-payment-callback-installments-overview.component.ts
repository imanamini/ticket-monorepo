import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NgxPaymentResult, PaymentResult } from '@digipay/ngx-payment-result';
import { ActivatedRoute, Router } from '@angular/router';

export const CallbackInstallmentsOverviewKey = 'source-url';

@Component({
  selector: 'app-credit-payment-callback-installments-overview',
  templateUrl: './credit-payment-callback-installments-overview.component.html',
  standalone: true,
  imports: [NgxPaymentResult],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPaymentCallbackInstallmentsOverviewComponent {
  // Services
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Inputs
  result = input.required<PaymentResult>();

  // Signals
  sourceUrl = signal<string | null>(null);

  // Variables
  defaultRedirectUrl = '/service/credit/installments-overview';

  constructor() {
    this.checkSourceUrl();
  }

  private checkSourceUrl() {
    const encodedSourceUrl = this.route.snapshot.queryParams[CallbackInstallmentsOverviewKey];
    if (encodedSourceUrl) {
      try {
        const sourceUrl = decodeURIComponent(encodedSourceUrl);
        this.sourceUrl.set(sourceUrl);
      } catch (e) {}
    }
  }

  onCloseClick() {
    if (this.result().paymentResult === 'success') {
      this.handleCloseOnSuccess();
    } else {
      this.handleCloseNotSuccess();
    }
  }

  private handleCloseOnSuccess() {
    if (this.sourceUrl()) {
      this.router.navigateByUrl(this.sourceUrl()!, {
        state: {
          customLinkForBack: '/',
        },
      });
    } else {
      this.router.navigateByUrl(this.defaultRedirectUrl, {
        state: {
          customLinkForBack: '/',
        },
      });
    }
  }

  private handleCloseNotSuccess() {
    if (this.sourceUrl()) {
      const encodedUrl = encodeURIComponent(this.sourceUrl()!);
      this.router.navigateByUrl(`${this.defaultRedirectUrl}?${CallbackInstallmentsOverviewKey}=${encodedUrl}`, {
        state: {
          customLinkForBack: this.sourceUrl(),
        },
      });
    } else {
      this.router.navigateByUrl(this.defaultRedirectUrl, {
        state: {
          customLinkForBack: '/',
        },
      });
    }
  }
}
