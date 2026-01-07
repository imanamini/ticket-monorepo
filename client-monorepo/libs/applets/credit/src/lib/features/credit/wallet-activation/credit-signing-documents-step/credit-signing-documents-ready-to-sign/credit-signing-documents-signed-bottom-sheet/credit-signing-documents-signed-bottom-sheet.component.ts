import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { GetSigningDocumentsItem } from '../../../../data-access/models/credit/activation/signing-documents-step/get-signing-documents-item';
import { CreditDigipayImageComponent } from '../../../../components/credit-digipay-image/credit-digipay-image.component';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { CreditPersianDatePipe } from '../../../../data-access/pipes/credit-persian-date.pipe';
import { DatePipe } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { BaseApiService } from '../../../../data-access/services/base-api.service';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { CreditDigikalaService } from '../../../../data-access/services/pillar/credit-digikala.service';
import { CreditDownloadService } from '../../../../data-access/services/credit-download.service';

@Component({
  selector: 'app-credit-signing-documents-signed-bottom-sheet',
  templateUrl: './credit-signing-documents-signed-bottom-sheet.component.html',
  styleUrls: ['./credit-signing-documents-signed-bottom-sheet.component.scss'],
  imports: [NgxBadgeModule, CreditDigipayImageComponent, NgxDividerComponent, NgxButtonComponent, NgxTrackableIdDirective],
  providers: [CreditPersianDatePipe, DatePipe],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSigningDocumentsSignedBottomSheetComponent implements OnInit {
  signImageId = signal<string | undefined>(undefined);
  document = signal<GetSigningDocumentsItem | undefined>(undefined);
  fullName = signal<string | undefined>(undefined);
  progressInfo = signal<{ index: number; total: number } | undefined>(undefined);

  private bottomSheetService = inject(NgxBottomSheetService);
  private creditPersianDatePipe = inject(CreditPersianDatePipe);
  private datePipe = inject(DatePipe);
  private apiService = inject(BaseApiService);
  private creditDownloadService = inject(CreditDownloadService);
  private gtmService = inject(NgxEventTrackerService);

  signDate = computed(() =>
    this.document() && this.document()?.signTime
      ? `${this.creditPersianDatePipe.transform(this.document()!.signTime, 'day')}  ${this.creditPersianDatePipe.transform(this.document()!.signTime, 'month')} - ${this.datePipe.transform(this.document()!.signTime, 'HH:mm')}`
      : '',
  );
  nextButtonLabel = computed(() => (this.progressInfo()?.index === this.progressInfo()?.total ? 'تایید و ادامه' : 'امضای سند بعدی'));

  ngOnInit() {
    if (this.bottomSheetService.data()) {
      const data = this.bottomSheetService.data();
      this.signImageId.set(data.signImageId);
      this.document.set(data.document);
      this.fullName.set(data.fullName);
      this.progressInfo.set(data.progressInfo);
    }
  }

  goToNextDocument() {
    this.bottomSheetService.closeBottomSheet();
  }

  downloadDoc(): void {
    this.sendEvent();
    this.apiService.getCreditImage(this.document()!.docId).subscribe((response) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = this.document()!.title + this.document()!.generationTime + '.pdf';
      anchor.href = url;
      anchor.click();
    });
  }

  private sendEvent(): void {
    const eventData = {
      event: 'CREDIT_SIGNING_DOCUMENT_DOWNLOAD',
      pageName: 'credit-signing-document-signed-bottom-sheet',
    };
    this.gtmService.sendEvent(eventData, { platforms: ['gtm'] });
  }

  protected readonly BorderColorsEnum = BorderColorsEnum;
}
