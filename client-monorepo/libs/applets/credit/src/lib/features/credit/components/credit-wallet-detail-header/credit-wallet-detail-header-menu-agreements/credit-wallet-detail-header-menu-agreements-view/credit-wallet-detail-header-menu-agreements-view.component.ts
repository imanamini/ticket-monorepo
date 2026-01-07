import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { CreditAgreementModel } from '../../../../data-access/models/credit/agreements/credit-agreement.model';
import { BaseApiService } from '../../../../data-access/services/base-api.service';
import { MessageService } from '../../../../data-access/services/message.service';
import { CreditAgreementTypeMapper } from '../../../../data-access/models/credit/agreements/credit-agreement-type';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { NgxIcon } from '@digipay/ngx-icon';
import { CreditScrollableViewComponent } from '../../../credit-scrollable-view/credit-scrollable-view.component';

@Component({
  selector: 'app-credit-wallet-detail-header-menu-agreements-view',
  templateUrl: './credit-wallet-detail-header-menu-agreements-view.component.html',
  styleUrls: ['./credit-wallet-detail-header-menu-agreements-view.component.scss'],
  standalone: true,
  imports: [NgxSpinnerModule, PdfViewerModule, NgxButtonComponent, PipesModule, NgxIcon, CreditScrollableViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditWalletDetailHeaderMenuAgreementsViewComponent implements OnInit {
  agreement = input<CreditAgreementModel>();

  backClicked = output<void>();

  gettingPdf = signal<boolean | null>(null);
  pdfInitiating = signal<boolean | null>(null);
  fileData = signal<Uint8Array | undefined>(undefined);
  zoom = signal(100);
  zoomStep = 20;
  maxZoom = signal(200);
  minZoom = signal(100);
  protected readonly CreditAgreementTypeMapper = CreditAgreementTypeMapper;

  constructor(
    private apiService: BaseApiService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    this.getAgreementPdf();
  }

  back() {
    this.backClicked.emit();
  }

  getAgreementPdf() {
    this.gettingPdf.set(true);
    this.apiService.getCreditImage(this.agreement()?.documentUrl!).subscribe({
      next: (response: Blob) => {
        response.arrayBuffer().then((arrayBuffer) => {
          const unit8Array = new Uint8Array(arrayBuffer);
          this.fileData.set(unit8Array);
          this.gettingPdf.set(false);
          this.pdfInitiating.set(true);
        });
      },
      error: (error) => this.messageService.showErrorOfErrorResponse(error),
    });
  }

  onLoadCompleted() {
    this.pdfInitiating.set(false);
  }

  zoomIn(): void {
    if (this.zoom() + this.zoomStep <= this.maxZoom()) {
      this.zoom.update((zoom) => zoom + this.zoomStep);
    }
  }

  zoomOut() {
    if (this.zoom() - this.zoomStep >= this.minZoom()) {
      this.zoom.update((zoom) => zoom - this.zoomStep);
    }
  }

  onDownloadHandler() {
    const blob = new Blob([this.fileData()!], {type: 'application/pdf'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = this.agreement()?.modificationTime + '.pdf';
    anchor.href = url;
    anchor.click();
  }
}
