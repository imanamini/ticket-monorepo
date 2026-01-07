import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LeadApiService } from '../../../../../../api/services/lead/lead-api.service';
import { LayoutService } from '../../../../../../../../data-access/services/layout.service';
import { ScreenSizeEnum } from '../../../../../../enums/screen-size.enum';
import { UnbundledService } from '../../services/unbundled.service';
import { LeadSerialRequiredComponent } from './lead-serial-required/lead-serial-required.component';
import { NgIf } from '@angular/common';
import { LeadVoucherComponent } from './lead-voucher/lead-voucher.component';
import { LeadModel } from '../../../../../../api/models/lead/lead.model';
import {
  EQUIPMENT_PRODUCT_CATEGORY_TRANSLATOR
} from '../../../../../../../../data-access/enums/equipment-product-category.enum';
import { isMobileOrTablet, MessageService } from '@client-monorepo/common/utilities';
import { INSURANCE_APP_PREFIX } from '../../../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'app-lead-service',
  templateUrl: './lead-service.component.html',
  styleUrls: ['./lead-service.component.scss'],
  imports: [LeadSerialRequiredComponent, NgIf, LeadVoucherComponent],
  standalone: true,
})
export class LeadServiceComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private leadApiService = inject(LeadApiService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private layoutService = inject(LayoutService);
  private unbundledService = inject(UnbundledService);

  // Inputs
  @Input()
  code;

  // Subscriptions
  subscriptions: Subscription[] = [];

  // Vars
  leadInfo: LeadModel;
  leadCode: string;
  size: ScreenSizeEnum;
  isSubmitting: boolean;
  isMobile = isMobileOrTablet();

  constructor() {
  }

  ngOnInit(): void {
    this.subscriptions[0] = this.layoutService.screenSizeChanged.subscribe({
      next: (size) => {
        this.size = size;
      },
    });
    this.getLeadInfo();
  }

  handlePayClick(): void {
    this.payRequest();
  }

  payRequest(): void {
    this.isSubmitting = true;
    this.subscriptions[5] = this.leadApiService.payRequest(this.leadCode).subscribe({
      next: (res) => {
        location.href = res.data.payUrl;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.messageService.showErrorIfExists(err);
      },
    });
  }

  newSerialSubmitted(serial): void {
    this.subscriptions[6] = this.leadApiService.changeSerialNumber(this.leadCode, serial).subscribe({
      next: (res) => {
        this.messageService.showApiSuccess(res);
        this.getLeadInfo();
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
      },
    });
  }

  getLeadInfo(): void {
    this.subscriptions[7] = this.route.queryParams.subscribe({
      next: ({code}) => {
        this.subscriptions[8] = this.leadApiService.getLeadInfo(code).subscribe(
          (res) => {
            if (res.data.policyNumber) {
              return this.router
                .navigate([`${INSURANCE_APP_PREFIX}/equipment/unbundled/payment-result`], {
                  queryParams: {providerId: res.data.providerId},
                })
                .then();
            }
            if (res.data.unUsable) {
              this.messageService.showInfoMessage(res.data.unUsableReason);
            }
            res.data.productCategoryFa = EQUIPMENT_PRODUCT_CATEGORY_TRANSLATOR[res.data.productCategory];
            this.leadCode = code;

            // convert rial to tuman
            res.data.productPrice = res.data.productPrice / 10;
            res.data.payableAmount = res.data.payableAmount / 10;
            res.data.discountAmount = res.data.discountAmount / 10;
            res.data.taxAmount = res.data.taxAmount / 10;
            res.data.displayWageAmount = res.data.displayWageAmount / 10;
            res.data.wageAmount = res.data.wageAmount / 10;
            res.data.wagePercent = res.data.wagePercent * 100;

            // check for remain days
            if (res.data.orderDeadLineDays === 0) {
              this.messageService.showInfoMessage('مهلت شما برای خرید این بیمه نامه تمام شده');
            }
            this.leadInfo = res.data;

            this.unbundledService.lead.next(res.data);
          },
          (error) => {
            this.messageService.showErrorIfExists(error);
            setTimeout(() => {
              this.router.navigate([`${INSURANCE_APP_PREFIX}/equipment/unbundled/home`]).then();
            }, 3000);
          },
        );
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
