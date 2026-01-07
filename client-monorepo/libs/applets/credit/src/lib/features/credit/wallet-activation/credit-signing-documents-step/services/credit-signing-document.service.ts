import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  GetSigningDocumentsItem
} from '../../../data-access/models/credit/activation/signing-documents-step/get-signing-documents-item';
import { BaseApiService } from '../../../data-access/services/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class CreditSigningDocumentsService {
  documents = new BehaviorSubject<{
    signedDocs: GetSigningDocumentsItem[];
    unsignedDocs: GetSigningDocumentsItem[];
  } | null>(null);

  apiService = inject(BaseApiService);

  setDocumentsData(data: { signedDocs: GetSigningDocumentsItem[]; unsignedDocs: GetSigningDocumentsItem[] }) {
    this.documents.next(data);
  }
}
