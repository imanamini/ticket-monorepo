import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { MessageService } from '../../../../data-access/services/message.service';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { InstallmentSaleDocumentResponse } from '../../../../data-access/models/credit/activation/cheque-step/installment-sale-document.response';
import { CreditChequeStepService } from '../../services/credit-cheque-step.service';
import {
  CREDIT_CHEQUE_DOCUMENT_STATUS,
  CREDIT_CHEQUE_DOCUMENT_STATUS_TRANSLATION,
  CreditChequeDocument,
} from '../../../../data-access/models/credit/activation/cheque-step/cheque-step-detail-response.model';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';

@Component({
  selector: 'app-credit-cheque-step-home-upload',
  templateUrl: './credit-cheque-step-home-upload.component.html',
  styleUrls: ['./credit-cheque-step-home-upload.component.scss'],
  imports: [
    NgxButtonComponent,
    NgxTrackableIdDirective,
    NgxIcon,
    NgxBadgeModule,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepHomeUploadComponent implements OnInit {
  data = signal<InstallmentSaleDocumentResponse | null>(null);
  chequeStatusEnum = CREDIT_CHEQUE_DOCUMENT_STATUS;
  chequeStatusTranslation = CREDIT_CHEQUE_DOCUMENT_STATUS_TRANSLATION;
  gettingData = signal<boolean>(true);
  enableSubmit = signal<boolean>(false);
  creditId = input.required<string>();
  nextStep = output();
  close = output();
  cheque = output<any>();
  chequeId = output<string>();
  openNotices = output();

  private messageService = inject(MessageService);
  private apiService = inject(CreditApiService);
  private creditChequeStepService = inject(CreditChequeStepService);

  ngOnInit(): void {
    this.apiService.getInstallmentSellsDetail(this.creditId()).subscribe({
      next: (result) => {
        this.gettingData.set(false);
        this.data.set(result);
        this.creditChequeStepService.documents.next(result.documents ? result.documents : []);
        this.enableSubmit.set(
          this.data()?.documents.every((obj) => {
            return obj.status === this.chequeStatusEnum.UPLOADED || obj.status === this.chequeStatusEnum.ACCEPTED;
          }) ?? false,
        );
      },
      error: (error) => {
        this.gettingData.set(false);
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  goToRegister(item: CreditChequeDocument, index: number) {
    if (this.isDocumentDisabled(item, index)) {
      return;
    }
    this.chequeId.emit(item.chequeId!);
    this.cheque.emit(item);
  }

  onSubmit() {
    this.apiService.installmentSellsConfirm(this.creditId()!).subscribe({
      next: () => {
        this.nextStep.emit();
      },
      error: (error) => {
        this.gettingData.set(false);
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  onActionClick() {
    this.openNotices.emit();
  }

  isDocumentDisabled(item: CreditChequeDocument, index: number) {
    const statusEnum = this.chequeStatusEnum;
    const currentStatus = item.status;

    if (currentStatus === statusEnum.ACCEPTED) {
      return true;
    }

    if (currentStatus === statusEnum.REJECTED || currentStatus === statusEnum.UPLOADED) {
      return false;
    }

    // For other statuses
    if (index > 0) {
      const previousStatus = this.data()?.documents[index - 1].status;

      if (previousStatus === statusEnum.UPLOADED) {
        return false;
      }
    }

    if (index === 0) {
      return false;
    }

    return true;
  }
}
