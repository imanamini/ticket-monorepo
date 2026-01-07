import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FineApiService, FinesResponse, FineStatus, InquiryType } from '@client-monorepo/daily-fintech/vehicle-data';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { NgxPlateComponent } from '@digipay/ngx-plate';
import { FineItemComponent } from '../../components/fine-item/fine-item.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { FineInquiryService } from '../../data-access/services/fine-inquiry.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'fine-applet-fine-list',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, NgxPlateComponent, FineItemComponent, PipesModule, NgxCalloutComponent, NgxButtonComponent],
  templateUrl: './fine-list.component.html',
  styleUrl: './fine-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FineListComponent implements OnInit {
  fineApiService = inject(FineApiService);
  fineInquiryService = inject(FineInquiryService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  trackingCode!: string;
  gettingReport = signal<boolean>(false);
  errorPage = signal<boolean>(false);
  fineResponse!: FinesResponse;
  noticeList = signal<string[]>([]);

  ngOnInit(): void {
    this.trackingCode = this.route.snapshot.params['trackingCode'];
    this.handleAfterPayment(this.route.snapshot.queryParams);
    this.getFineReportByTrackingCode();
  }

  retry() {
    this.errorPage.set(false);
    this.getFineReportByTrackingCode();
  }

  private handleAfterPayment(queryParams: Params) {
    if (queryParams['status'] === 'FAILED') {
      this.router.navigate(['fine', 'select-method', this.route.snapshot.queryParams['plateNo']]).then();
    }
    if (queryParams['trackingCode']) {
      this.trackingCode = queryParams['trackingCode'];
    }
  }

  private generateNoticeList() {
    this.noticeList.set(this.fineResponse.trafficFinesDto.reportAlert?.descriptionItems.map((item) => item.note) || []);
  }

  private getFineReportByTrackingCode() {
    this.gettingReport.set(true);
    this.fineApiService.getFineReport(this.trackingCode).subscribe({
      next: (res) => {
        this.fineResponse = res;
        this.fineInquiryService.reportedFines.set(res);
        this.generateNoticeList();
        this.gettingReport.set(false);
      },
      error: (error) => {
        this.errorPage.set(true);
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  protected readonly FineStatus = FineStatus;

  newInquiry() {
    this.router.navigate(['fine', 'select-method', this.fineResponse.trafficFinesDto.plateNo]).then();
  }

  payTotalDebt() {
    this.fineInquiryService.payFine({
      trackingCode: this.trackingCode,
      amount: this.fineResponse.trafficFinesDto.totalAmount.amount,
      billId: this.fineResponse.trafficFinesDto.billId,
      paymentId: this.fineResponse.trafficFinesDto.paymentId,
      inquiryType: this.fineResponse.trafficFinesDto.inquiryType,
    });
  }

  protected readonly InquiryType = InquiryType;

  onBack() {
    this.router.navigate(['fine']).then();
  }
}
