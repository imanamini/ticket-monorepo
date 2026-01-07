import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { CreditImageDialogComponent } from '../../../../components/credit-image-dialog/credit-image-dialog.component';
import { PhysicalNoteDocument } from '../../../../data-access/models/credit/activation/enote-step/physical-note-detail-response';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditDigipayImageComponent } from '../../../../components/credit-digipay-image/credit-digipay-image.component';

@Component({
  selector: 'app-credit-physical-enote-step-error',
  templateUrl: './credit-physical-enote-step-error.component.html',
  styleUrls: ['./credit-physical-enote-step-error.component.scss', '../../credit-enote.scss'],
  standalone: true,
  imports: [
    NgxCalloutComponent,
    NgxButtonComponent,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    CreditDigipayImageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPhysicalEnoteStepErrorComponent implements OnInit {
  creditId = input.required<string>();
  close = output<void>();
  openNotices = output<void>();
  actionClicked = output<void>();

  gettingData = true;
  showLoading = signal<boolean | null>(null);
  document = signal<PhysicalNoteDocument | null>(null);

  bottomSheetService = inject(NgxBottomSheetService);
  apiService = inject(CreditApiService);

  ngOnInit(): void {
    this.getPhysicalNoteDetail();
  }

  getPhysicalNoteDetail() {
    this.showLoading.set(true);
    this.apiService.getPhysicalNoteDetail(this.creditId()).subscribe({
      next: (res) => {
        this.showLoading.set(false);
        this.document.set(res.document);
      },
      error: () => {
        this.showLoading.set(false);
      },
    });
  }

  onActionClick() {
    this.openNotices.emit();
  }

  onSubmit() {
    this.actionClicked.emit();
  }

  openImageDialog() {
    this.bottomSheetService.openBottomSheet(CreditImageDialogComponent, {
      imageId: this.document()?.imageId,
    });
  }
}
