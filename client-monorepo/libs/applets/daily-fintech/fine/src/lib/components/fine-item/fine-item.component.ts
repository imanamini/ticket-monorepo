import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { Fine, FineStatus, InquiryType } from '@client-monorepo/daily-fintech/vehicle-data';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { FineInquiryService } from '../../data-access/services/fine-inquiry.service';
import { Router } from '@angular/router';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'fine-applet-item',
  standalone: true,
  imports: [CommonModule, DpIconComponent, PipesModule, NgxBadgeModule, NgxIcon, NgxButtonComponent],
  templateUrl: './fine-item.component.html',
  styleUrl: './fine-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FineItemComponent {
  finePaymentService = inject(FineInquiryService);
  router = inject(Router);
  fine = input.required<Fine>();
  trackingCode = input<string>('');
  inquiryType = input<InquiryType>(InquiryType.GENERAL);
  protected readonly FineStatus = FineStatus;

  pay() {
    this.finePaymentService.payFine({
      trackingCode: this.trackingCode(),
      amount: this.fine().fineDetail.amount,
      inquiryType: this.inquiryType(),
      paymentId: this.fine().fineDetail.paymentId,
      billId: this.fine().fineDetail.billId,
    });
  }

  showImage() {
    this.router
      .navigate(['fine', 'image'], {
        queryParams: { trackingCode: this.trackingCode(), violationId: this.fine().violationId },
      })
      .then();
  }
}
