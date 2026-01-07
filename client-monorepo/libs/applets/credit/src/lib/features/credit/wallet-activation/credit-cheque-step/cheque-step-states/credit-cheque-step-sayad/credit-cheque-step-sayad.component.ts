import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import Clipboard from '../../../../data-access/utils/clipboard';
import { MessageService } from '../../../../data-access/services/message.service';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { CreditChequeStepService } from '../../services/credit-cheque-step.service';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditStepperComponent } from '../../../../components/credit-stepper/credit-stepper.component';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditChequeSayadHintBottomSheetComponent } from '../../credit-cheque-sayad-hint-bottom-sheet/credit-cheque-sayad-hint-bottom-sheet.component';

const installmentVideoUrl = 'https://www.mydigipay.com/api/website/proxy/get-file/public/2023/01/5b5a3af5-8b96-49b9-83de-4bad44290aaa.mp4';
const chequeVideoUrl = 'https://www.mydigipay.com/api/website/proxy/get-file/public/2024/12/witing-cheque.mp4';

@Component({
  selector: 'app-credit-cheque-step-sayad',
  templateUrl: './credit-cheque-step-sayad.component.html',
  styleUrls: ['./credit-cheque-step-sayad.component.scss'],
  imports: [
    NgxIcon,
    NgxDividerComponent,
    NgxButtonComponent,
    NgxTrackableIdDirective,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    CreditStepperComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepSayadComponent implements OnInit {
  hintButtons: Buttons = {
    id: 'primary',
    style: 'tinted-on-elevated',
    label: 'مشاهده اطلاعات',
    mode: 'section',
  };

  showHint = signal(true);
  showLoading = signal(false);
  guides = signal<Array<{ name: string; label: string; value: string; copyable: boolean; currency?: boolean }>>([]);
  loading = input<boolean>(false);
  chequeOrder = input<number>();
  creditId = input.required<string>();
  isInstallment = input<boolean>(true);
  prevStep = output<void>();
  submit = output<boolean>();
  protected readonly BorderColorsEnum = BorderColorsEnum;

  private bottomSheetService = inject(NgxBottomSheetService);
  private messageService = inject(MessageService);
  private apiService = inject(CreditApiService);
  private creditChequeStepService = inject(CreditChequeStepService);

  ngOnInit(): void {
    this.getChequeInfo();
    if (!this.isInstallment()) {
      return;
    }
    this.apiService.getInstallmentSellsDetail(this.creditId()).subscribe({
      next: (result) => {
        this.creditChequeStepService.documents.next(result.documents ? result.documents : []);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  openSayadHintBottomSheet() {
    this.bottomSheetService.openBottomSheet(
      CreditChequeSayadHintBottomSheetComponent,
      {},
      {
        noPadding: true,
      },
    );
  }

  getChequeInfo() {
    this.showLoading.set(true);
    this.apiService.getChequeGuid(this.creditId()!, this.isInstallment(), this.chequeOrder()!).subscribe({
      next: (response) => {
        this.showLoading.set(false);
        const chequeId = {
          name: 'chequeId',
          label: 'شناسه صیاد',
          value: this.creditChequeStepService.data.chequeId,
          copyable: false,
        };
        const amount = {
          name: 'amount',
          label: 'مبلغ',
          value: response.amount,
          copyable: true,
          currency: true,
        };
        const dueDate = {
          name: 'dueDate',
          label: 'تاریخ',
          value: response.dueDate,
          copyable: false,
        };
        const sayadiDesc = {
          name: 'sayadiDesc',
          label: 'شرح',
          value: 'تسویه',
          copyable: false,
        };
        const sayadiFor = {
          name: 'sayadiFor',
          label: 'بابت',
          value: 'خرید کالا',
          copyable: false,
        };
        const sayadiUnderwriter = {
          name: 'sayadiUnderwriter',
          label: 'نام گیرنده(دروجه)',
          value: response.receiverName,
          copyable: false,
        };
        const underwriterNationalId = {
          name: 'underwriterNationalId',
          label: 'شناسه ملی',
          value: response.receiverNationalId,
          copyable: true,
        };
        const sayadiPersonType = {
          name: 'sayadiPersonType',
          label: 'نوع شخص',
          value: 'حقوقی',
          copyable: false,
        };

        const divider = {
          name: '',
          label: '',
          value: 'divider',
          copyable: false,
        };

        this.guides.update((guide) => [
          ...guide,
          chequeId,
          amount,
          dueDate,
          divider,
          sayadiDesc,
          sayadiFor,
          divider,
          sayadiUnderwriter,
          underwriterNationalId,
          sayadiPersonType,
        ]);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.showLoading.set(false);
        this.prevStep.emit();
      },
    });
  }

  copyToClipboard(value: string): void {
    Clipboard.copy(value);
    this.messageService.showMessage('کپی شد');
  }
}
