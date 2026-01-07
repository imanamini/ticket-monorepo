import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { MessageService } from '../../../../data-access/services/message.service';
import { FormsModule } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';

@Component({
  selector: 'app-credit-physical-enote-step-guide',
  templateUrl: './credit-physical-enote-step-guide.component.html',
  styleUrls: ['./credit-physical-enote-step-guide.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgxButtonComponent,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    NgxCheckboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPhysicalEnoteStepGuideComponent implements OnInit {
  guides = signal<Array<{ title: string; value: string }>>([]);
  accepted = signal<boolean>(false);
  warningShake = signal<boolean | null>(null);
  gettingData = signal(true);
  creditId = input.required<string>();

  nextStep = output<void>();
  prevStep = output<void>();
  openNotices = output<void>();

  private apiService = inject(CreditApiService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.apiService.getPhysicalNoteGuide(this.creditId()).subscribe({
      next: (response) => {
        this.guides.set([
          {
            title: 'مبلغ به عدد',
            value: response.amount,
          },
          {
            title: 'تاریخ صدور به حروف',
            value: response.dateInLetters,
          },
          {
            title: 'تاریخ سررسید',
            value: response.dueDate,
          },
          {
            title: 'در وجه',
            value: response.receiverName,
          },
          {
            title: 'شناسه ملی',
            value: response.receiverNationalId,
          },
          {
            title: 'مبلغ به حروف',
            value: response.amountInLetters,
          },
          {
            title: 'اطلاعات شخصی',
            value: response.personalInfo,
          },
          {
            title: 'محل اقامت',
            value: response.addressInfo,
          },
          {
            title: 'محل پرداخت',
            value: response.paymentAddressInfo,
          },
          {
            title: 'محل امضای سفته',
            value: response.signaturePlace,
          },
        ]);
        this.gettingData.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.gettingData.set(false);
      },
    });
  }

  runWarningShake(): void {
    this.warningShake.set(true);
    setTimeout(() => {
      this.warningShake.set(false);
    }, 400);
  }

  onSubmit() {
    if (!this.accepted()) {
      this.runWarningShake();
      return;
    }
    this.nextStep.emit();
  }

  onTextClick() {
    this.openNotices.emit();
  }
}
