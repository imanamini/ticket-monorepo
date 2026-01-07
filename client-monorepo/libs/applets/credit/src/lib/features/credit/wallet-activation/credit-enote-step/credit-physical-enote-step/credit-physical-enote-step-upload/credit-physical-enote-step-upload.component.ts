import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { MessageService } from '../../../../data-access/services/message.service';
import { zip } from 'rxjs';
import { PhysicalNoteDocument } from '../../../../data-access/models/credit/activation/enote-step/physical-note-detail-response';
import { CreditNoteService } from '../../credit-note.service';
import { CreditPhysicalEnoteUploadFileTileComponent } from './credit-physical-enote-upload-file-tile/credit-physical-enote-upload-file-tile.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';

@Component({
  selector: 'app-credit-physical-enote-step-upload',
  templateUrl: './credit-physical-enote-step-upload.component.html',
  styleUrls: ['../../credit-enote.scss'],
  standalone: true,
  imports: [
    CreditPhysicalEnoteUploadFileTileComponent,
    NgxButtonComponent,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPhysicalEnoteStepUploadComponent implements OnInit {
  creditId = input.required<string>();
  fundProviderCode = input.required<number>();
  switchTypePossible = input<boolean>();

  finish = output<void>();
  nextStep = output<void>();
  prevStep = output<void>();
  changeNoteTypeClicked = output<void>();
  goToStep = output<string>();

  transformedStepChild = signal<any>(null);
  document!: PhysicalNoteDocument;
  isRelative!: boolean;
  disableSubmit = signal(true);
  showLoading = signal<boolean | null>(null);
  maxUploadSize = signal(0);

  private apiService = inject(CreditApiService);
  private messageService = inject(MessageService);
  private noteService = inject(CreditNoteService);

  ngOnInit() {
    this.getNeededInfo();
  }

  getActivationConfigRequest() {
    return this.apiService.getActivationConfig();
  }

  getPhysicalNoteDetail() {
    return this.apiService.getPhysicalNoteDetail(this.creditId());
  }

  getNeededInfo() {
    this.showLoading.set(true);
    zip(this.getActivationConfigRequest(), this.getPhysicalNoteDetail()).subscribe({
      next: (res) => {
        this.showLoading.set(false);
        this.maxUploadSize.set(res[0].maxUploadSize);
        this.document = res[1].document;
        this.transformStep();
      },
      error: (e) => {
        this.showLoading.set(false);
        this.messageService.showErrorOfErrorResponse(e);
      },
    });
  }

  onReload() {
    this.disableSubmit.set(false);
  }

  transformStep() {
    const step = {
      active: true,
      color: 0,
      kind: 'ENOTE',
      moreInfo: false,
      open: false,
      state: '',
      stepTag: 8,
      stepTagText: null,
      typeText: null,
    };

    this.transformedStepChild.set(
      Object.assign({}, step, {
        code: this.document?.tag,
        disabled: this.document?.option === 2 && !this.isRelative,
        option: this.document?.option,
        primary: this.document?.option === 1 || (this.document?.option === 2 && this.isRelative),
        stepResult: this.document.imageId,
        stepTag: this.document.tag,
        title: 'تصویر روی ' + this.document.title,
        status: this.convertDocStatusToStepStatus(this.document.status),
        statusText: this.convertDocStatusToStepStatusText(this.document.status),
      }),
    );
  }

  convertDocStatusToStepStatus(status: any) {
    const map: { [key: number]: number } = {
      0: 0,
      1: 2,
      2: 3,
      3: 4,
    };
    return map[status] ? map[status] : map[0];
  }

  convertDocStatusToStepStatusText(status: any) {
    const map: { [key: number]: string } = {
      0: 'INITIATE',
      1: 'INITIATE',
      2: 'COMPLETED',
      3: 'OPERATIONAL_REJECTION',
    };
    return map[status] ? map[status] : map[0];
  }

  onFinish() {
    this.showLoading.set(true);
    this.apiService.confirmPhysicalNote(this.creditId()).subscribe({
      next: (_) => {
        this.showLoading.set(false);
        this.noteService.closeStep(this.fundProviderCode(), this.creditId());
      },
      error: (e) => {
        this.showLoading.set(false);
        this.messageService.showErrorOfErrorResponse(e);
      },
    });
  }
}
