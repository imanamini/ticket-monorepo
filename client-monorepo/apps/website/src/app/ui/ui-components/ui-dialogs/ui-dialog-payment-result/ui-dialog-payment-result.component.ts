import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaymentResultDialogData } from './models/payment-result-dialog-data';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { RedirectService } from '../../../../core/services/redirect.service';
import { ScreenSize } from '../../../../api/digipay/models/common/screen-size';
import { LayoutService } from '../../../../website/services/layout.service';
import { Router } from '@angular/router';
import { PaymentResultStatus } from '../../../../api/digipay/models/payment/payment-result';
import { PaymentResultComponent } from '../../ui-payment/payment-result/payment-result.component';
import { NgIf } from '@angular/common';
import { UiDialogBaseComponent } from '../ui-dialog-base/ui-dialog-base.component';

@Component({
  selector: 'app-ui-dialog-payment-result',
  templateUrl: './ui-dialog-payment-result.component.html',
  styleUrls: ['./ui-dialog-payment-result.component.scss'],
  standalone: true,
  imports: [UiDialogBaseComponent, NgIf, PaymentResultComponent],
})
export class UiDialogPaymentResultComponent implements OnInit, OnDestroy {
  isMobile = false;

  subscriptions: Subscription[] = [];

  appCloseUrl = null;

  redirecting = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PaymentResultDialogData,
    private layoutService: LayoutService,
    private matDialogRef: MatDialogRef<UiDialogPaymentResultComponent>,
    private domSanitizer: DomSanitizer,
    private redirectService: RedirectService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscriptions[0] = this.layoutService.screenSizeChanged.subscribe((size) => {
      this.isMobile = size === ScreenSize.isMobile;
    });
    if (this.data.paymentResult && this.data.paymentResult.status) {
      this.router.navigate([], {
        queryParams: {
          [this.data.statusKey ? this.data.statusKey : 'status']:
            this.data.paymentResult.paymentResult === PaymentResultStatus.SUCCESS ? 'successful' : 'unsuccessful',
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  onClose(): void {
    this.matDialogRef.close();
    this.router.navigate([]);
    /*if (!this.data.inApp) {
      this.matDialogRef.close();
    } else {
      if (this.data.backButtonText) {
        window.location.href = this.appHomeUrl;
      } else {
        this.matDialogRef.close();
      }
    }*/
  }

  redirectToCompletePurchase(): void {
    const rd = this.data.paymentResult.redirectDetail;

    const parts = rd.data.split('&');
    const formData = {};
    parts.forEach((str) => {
      const p = str.split('=');
      formData[p[0]] = decodeURIComponent(p[1]);
    });

    this.redirecting = true;

    this.redirectService.redirect(rd.path, formData);
  }
}
