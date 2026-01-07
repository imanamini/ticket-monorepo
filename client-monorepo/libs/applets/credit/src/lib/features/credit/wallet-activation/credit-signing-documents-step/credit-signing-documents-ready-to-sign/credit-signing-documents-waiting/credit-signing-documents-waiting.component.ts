import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { GetSigningDocumentsItem } from '../../../../data-access/models/credit/activation/signing-documents-step/get-signing-documents-item';
import { CreditSigningDocumentsListItemComponent } from '../credit-signing-documents-list-item/credit-signing-documents-list-item.component';
import { CreditSigningDocumentsService } from '../../services/credit-signing-document.service';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';

@Component({
  selector: 'app-credit-signing-documents-waiting',
  templateUrl: './credit-signing-documents-waiting.component.html',
  styleUrls: ['./credit-signing-documents-waiting.component.scss'],
  standalone: true,
  imports: [CreditSigningDocumentsListItemComponent, NgxStatusResultModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSigningDocumentsWaitingComponent implements OnInit {
  documents = signal<GetSigningDocumentsItem[]>([]);
  containerClass = computed(() => (this.documents().length ? '' : 'justify-content-center align-items-center'));

  creditSigningDocumentService = inject(CreditSigningDocumentsService);

  ngOnInit(): void {
    this.documents.set(this.creditSigningDocumentService.documents.getValue()?.unsignedDocs!);
  }
}
