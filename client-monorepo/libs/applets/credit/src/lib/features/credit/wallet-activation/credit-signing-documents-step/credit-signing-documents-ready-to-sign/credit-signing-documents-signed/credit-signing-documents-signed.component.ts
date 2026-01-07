import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { GetSigningDocumentsItem } from '../../../../data-access/models/credit/activation/signing-documents-step/get-signing-documents-item';
import { CreditSigningDocumentsListItemComponent } from '../credit-signing-documents-list-item/credit-signing-documents-list-item.component';
import { CreditSigningDocumentsService } from '../../services/credit-signing-document.service';

@Component({
  selector: 'app-credit-signing-documents-signed',
  templateUrl: './credit-signing-documents-signed.component.html',
  styleUrls: ['./credit-signing-documents-signed.component.scss'],
  standalone: true,
  imports: [CreditSigningDocumentsListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSigningDocumentsSignedComponent implements OnInit {
  documents = signal<GetSigningDocumentsItem[]>([]);

  creditSigningDocumentService = inject(CreditSigningDocumentsService);

  ngOnInit(): void {
    this.documents.set(this.creditSigningDocumentService.documents.getValue()?.signedDocs!);
  }
}
