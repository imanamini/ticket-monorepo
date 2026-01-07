import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { MessageService } from '../../../data-access/services/message.service';
import { GetSigningDocumentsItem } from '../../../data-access/models/credit/activation/signing-documents-step/get-signing-documents-item';
import { SigningDocumentItemStatus } from '../../../data-access/models/credit/activation/signing-documents-step/signing-document-item-status';
import { BaseApiService } from '../../../data-access/services/base-api.service';
import { CreditSigningDocumentsListComponent } from './credit-signing-documents-list/credit-signing-documents-list.component';
import { CreditSigningDocumentsSingleComponent } from './credit-signing-documents-single/credit-signing-documents-single.component';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';

@Component({
  selector: 'app-credit-signing-documents-ready-to-sign',
  templateUrl: './credit-signing-documents-ready-to-sign.component.html',
  styleUrls: ['./credit-signing-documents-ready-to-sign.component.scss'],
  imports: [CreditSigningDocumentsListComponent, CreditSigningDocumentsSingleComponent, CreditPageLoadingComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSigningDocumentsReadyToSignComponent implements OnInit {
  creditId = input.required<string>();
  continueSigning = input<boolean>();
  gettingData = signal<boolean | null>(null);
  documents = signal<GetSigningDocumentsItem[] | null>(null);
  fullName = signal<string | null>(null);
  fundProviderIcon = signal<string | null>(null);
  description = signal<string | null>(null);
  activeDocIndex = signal(-1);
  needPassword = input(false);

  close = output<void>();
  signedDocument = output<void>();

  private apiService = inject(BaseApiService);
  private creditApiService = inject(CreditApiService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.getDocuments();
  }

  getDocuments(): void {
    this.gettingData.set(true);
    this.creditApiService.getSigningDocumentsListItems(this.creditId()).subscribe({
      next: (response) => {
        this.documents.set(response.documents);
        this.fullName.set(response.userFullName);
        this.description.set(response.description);
        this.fundProviderIcon.set(response.fundProviderIcon);
        if (
          this.continueSigning() ||
          !this.documents()?.find(
            (doc) => doc.status === SigningDocumentItemStatus.SIGNED || doc.status === SigningDocumentItemStatus.SEALED,
          )
        ) {
          this.goToFirstUnsignedDocument();
        }
        this.gettingData.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  onBack() {
    this.close.emit();
  }

  goToFirstUnsignedDocument(): void {
    let activeDocIndex = -1;
    this.documents()?.forEach((value, index) => {
      if (activeDocIndex >= 0) {
        return;
      }
      if (value.status === SigningDocumentItemStatus.READY_TO_SIGN) {
        activeDocIndex = index;
      }
    });
    if (activeDocIndex >= 0) {
      this.activeDocIndex.set(activeDocIndex);
    }
  }

  nextDocument(): void {
    this.signedDocument.emit();
  }

  downloadAllDocs(docs: GetSigningDocumentsItem[]) {
    docs.forEach((doc) => {
      this.downloadDoc(doc);
    });
  }

  downloadDoc(doc: GetSigningDocumentsItem): void {
    this.apiService.getCreditImage(doc.docId).subscribe((response) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = doc.title + doc.generationTime + '.pdf';
      anchor.href = url;
      anchor.click();
    });
  }
}
