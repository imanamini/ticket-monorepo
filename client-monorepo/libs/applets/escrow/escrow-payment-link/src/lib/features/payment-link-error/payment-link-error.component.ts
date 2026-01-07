import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PaymentLinkStatusHeaderComponent } from '../../components/payment-link-status-header/payment-link-status-header.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ActivatedRoute } from '@angular/router';
import {
  PaymentLinkError,
  PaymentLinkErrorTranslate,
  PaymentLinkHeaderConfig,
} from '../../data-access/model/payment-link-status-header.model';

@Component({
  selector: 'escrow-payment-link-error',
  standalone: true,
  imports: [CommonModule, PaymentLinkStatusHeaderComponent, NgxButtonComponent, PageLayoutComponent],
  templateUrl: './payment-link-error.component.html',
  styleUrl: './payment-link-error.component.scss',
})
export class PaymentLinkErrorComponent {
  private route = inject(ActivatedRoute);

  public get errorCode(): PaymentLinkError {
    return this.route.snapshot.queryParams['errorCode'];
  }  
  
  public get cellNumber(): string {
    return this.route.snapshot.queryParams['cellNumber'];
  }

  public get errorCodeTranslate(): PaymentLinkHeaderConfig {
    return PaymentLinkErrorTranslate[this.errorCode];
  }

  onNavigate() {
    window.location.replace(PaymentLinkErrorTranslate[this.errorCode].redirectUrl);
  }

  protected readonly PaymentLinkErrorTranslate = PaymentLinkErrorTranslate;
}
