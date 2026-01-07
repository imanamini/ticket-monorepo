import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { GetSigningDocumentsItem } from '../../../../data-access/models/credit/activation/signing-documents-step/get-signing-documents-item';
import { SigningDocumentItemStatus } from '../../../../data-access/models/credit/activation/signing-documents-step/signing-document-item-status';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BaseApiService } from '../../../../data-access/services/base-api.service';
import { MessageService } from '../../../../data-access/services/message.service';

@Component({
  selector: 'app-credit-signing-documents-list-item',
  templateUrl: './credit-signing-documents-list-item.component.html',
  styleUrls: ['./credit-signing-documents-list-item.component.scss'],
  imports: [PipesModule, PdfViewerModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSigningDocumentsListItemComponent implements OnInit {
  document = input<GetSigningDocumentsItem>();
  documentStatusEnum = SigningDocumentItemStatus;
  fileData = signal<Uint8Array | undefined>(undefined);
  loadedDoc = signal<string | null>(null);
  signedDate = computed(() =>
    this.document()?.status === this.documentStatusEnum.SIGNED || this.document()?.status === this.documentStatusEnum.SEALED
      ? this.document()?.signTime
      : this.document()?.generationTime,
  );

  private apiService = inject(BaseApiService);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.getPdfFile(this.document()!.docId);
  }

  private getPdfFile(docId: string): void {
    if (docId === this.loadedDoc()) {
      return;
    }
    this.loadedDoc.set(null);
    if (!docId) {
      return;
    }
    this.apiService.getCreditImage(docId).subscribe({
      next: (res) => {
        res.arrayBuffer().then((arrayBuffer: ArrayBuffer) => {
          const unit8Array = new Uint8Array(arrayBuffer);
          this.fileData.set(unit8Array);
        });
        this.loadedDoc.set(docId);
      },
      error: (e) => {
        this.messageService.showErrorOfErrorResponse(e);
      },
    });
  }
}
