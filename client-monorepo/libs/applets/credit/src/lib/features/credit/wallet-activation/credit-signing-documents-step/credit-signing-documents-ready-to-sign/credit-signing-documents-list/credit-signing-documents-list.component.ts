import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { GetSigningDocumentsItem } from '../../../../data-access/models/credit/activation/signing-documents-step/get-signing-documents-item';
import { SigningDocumentItemStatus } from '../../../../data-access/models/credit/activation/signing-documents-step/signing-document-item-status';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { TabConfig } from '../../../../data-access/models/tabs-config';
import { TabGroupComponent } from '../../../../components/tab-group/tab-group.component';
import { CreditSigningDocumentsWaitingComponent } from '../credit-signing-documents-waiting/credit-signing-documents-waiting.component';
import { CreditSigningDocumentsSignedComponent } from '../credit-signing-documents-signed/credit-signing-documents-signed.component';
import { CreditSigningDocumentsService } from '../../services/credit-signing-document.service';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';

const TAB_CONFIGURATIONS = [
  {
    id: 'waiting',
    label: 'اسناد در انتظار',
    component: CreditSigningDocumentsWaitingComponent,
    isActive: true,
  },
  {
    id: 'signed',
    label: 'اسناد امضا شده',
    component: CreditSigningDocumentsSignedComponent,
    isActive: false,
  },
] as const;

@Component({
  selector: 'app-credit-signing-documents-list',
  templateUrl: './credit-signing-documents-list.component.html',
  styleUrls: ['./credit-signing-documents-list.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, NgxTrackableIdDirective, TabGroupComponent, CreditAppBarComponent, CreditScrollableViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSigningDocumentsListComponent implements OnInit {
  documents = input<GetSigningDocumentsItem[]>();
  description = input<string>();
  docGroup = signal<{
    signedDocs: GetSigningDocumentsItem[];
    unsignedDocs: GetSigningDocumentsItem[];
  } | null>(null);
  tabs = signal<Array<TabConfig>>([]);

  gettingData!: boolean;
  startSigning = output<void>();
  back = output<void>();
  downloadAllDocs = output<GetSigningDocumentsItem[]>();

  activeTab = computed(() => this.tabs().find((item) => item.isActive())?.id);

  creditSigningDocumentService = inject(CreditSigningDocumentsService);

  ngOnInit(): void {
    this.initTabs();
    this.categorizeDocuments();
  }

  categorizeDocuments(): void {
    this.docGroup.set(null);
    const signedDocs: GetSigningDocumentsItem[] = [];
    const unsignedDocs: GetSigningDocumentsItem[] = [];
    this.documents()?.forEach((doc) => {
      if (doc.status === SigningDocumentItemStatus.SIGNED || doc.status === SigningDocumentItemStatus.SEALED) {
        signedDocs.push(doc);
      } else {
        unsignedDocs.push(doc);
      }
    });
    this.creditSigningDocumentService.setDocumentsData({
      signedDocs,
      unsignedDocs,
    });
    if (signedDocs.length) {
      this.docGroup.update((data) => ({
        ...data!,
        signedDocs: signedDocs,
      }));
    }
    if (unsignedDocs.length) {
      this.docGroup.update((data) => ({
        ...data!,
        unsignedDocs: unsignedDocs,
      }));
    }
  }

  onBack(): void {
    this.back.emit();
  }

  submit(): void {
    this.startSigning.emit();
  }

  private initTabs() {
    this.tabs.set(
      TAB_CONFIGURATIONS.map((config) => ({
        id: config.id,
        label: signal(config.label),
        isActive: signal(config.isActive),
        component: signal(config.component),
      })),
    );
  }
}
