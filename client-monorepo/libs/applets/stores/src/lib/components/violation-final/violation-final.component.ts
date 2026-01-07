import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Router } from '@angular/router';
import { ViolationService } from '../../data-access/services/violation.service';
import { StoresApiService } from '@client-monorepo/stores';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { ViolationDataModel } from '../../data-access/models/violation.model';
import { BackHandlerService } from '@client-monorepo/back-handler';

@Component({
  selector: 'stores-applet-violation-final',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxSpinnerModule],
  templateUrl: './violation-final.component.html',
  styleUrl: './violation-final.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViolationFinalComponent implements OnInit {
  router = inject(Router);
  violationService = inject(ViolationService);
  storesApi = inject(StoresApiService);
  backHandlerService = inject(BackHandlerService);

  violationData!: ViolationDataModel;
  showSuccess = signal(false);
  showError = signal(false);
  errorText = signal('مشکلی در ثبت گزارش بوجود آمده است!');

  ngOnInit(): void {
    this.submitViolation();
  }

  uploadDocuments(violationReportUid: string): void {
    if (this.violationData?.documents?.files) {
      for (const fileSchema of this.violationData.documents!.files) {
        if (fileSchema.file) {
          this.storesApi.uploadViolationReportImages(violationReportUid, fileSchema.file).subscribe();
        }
      }
    }
  }

  submitViolation(): void {
    this.violationData = {
      purchaseStatus: this.violationService?.purchaseStatus(),
      reasons: this.violationService?.reasons(),
      purchase: this.violationService?.purchase(),
      purchaseType: this.violationService?.purchaseType(),
      PaymentMethod: this.violationService?.paymentMethod(),
      documents: this.violationService?.documents(),
    };
    const store = this.violationService.guaranteedStore();
    this.storesApi
      .submitViolation({
        activityTrackingCode: this.violationData.purchase?.activityTrackingCode,
        description: this.violationData.documents?.description,
        reasons: this.violationData.reasons,
        storeTrackingCode: store!.trackingCode,
        type: store!.types[0],
      })
      .subscribe({
        next: (res) => {
          this.showSuccess.set(true);
          this.uploadDocuments(res.uid);
        },
        error: (err) => {
          this.showError.set(true);
          if (err.error?.result?.message) this.errorText.set(err.error.result.message);
        },
      });
  }

  goToShop(): void {
    this.router.navigate(['/stores']);
  }

  retry(): void {
    window.location.reload();
  }
}
