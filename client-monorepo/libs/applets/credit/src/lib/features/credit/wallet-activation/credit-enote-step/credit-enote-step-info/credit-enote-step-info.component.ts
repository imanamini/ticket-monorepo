import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { CreditNoServiceDialogComponent } from '../../../components/credit-no-service-dialog/credit-no-service-dialog.component';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { MessageService } from '../../../data-access/services/message.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditEnoteStepInfoFormComponent } from '../credit-enote-step-info-form/credit-enote-step-info-form.component';
import { CreditEnoteStepInfoShowComponent } from '../credit-enote-step-info-show/credit-enote-step-info-show.component';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';

@Component({
  selector: 'app-credit-enote-step-info',
  templateUrl: './credit-enote-step-info.component.html',
  standalone: true,
  imports: [CreditEnoteStepInfoFormComponent, CreditEnoteStepInfoShowComponent, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEnoteStepInfoComponent implements OnInit {
  creditId = input.required<string>();
  switchTypePossible = input<boolean>();
  fieldErrors = input<{ fieldName: string; text: string }[]>();

  back = output<void>();
  finish = output<void>();
  changeNoteTypeClicked = output<void>();
  goToSana = output<void>();

  gettingData = signal<boolean | null>(null);
  pageTitle = signal('سفته‌ی الکترونیک');
  imageId = signal<string | null>(null);
  description = signal<string | null>(null);
  payAmount = signal<number | null>(null);
  hintMessage = signal<{
    title: string;
    description: string;
  } | null>(null);
  ibanRequired = signal<boolean | null>(null);
  guaranteeAmount = signal<number | null>(null);
  iban = signal<string | null>(null);
  hasRenew = signal<boolean | null>(null);

  creditApiService = inject(CreditApiService);
  bottomSheetService = inject(NgxBottomSheetService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.gettingData.set(true);
    this.creditApiService.getEnoteOnBoardingPage(this.creditId()).subscribe({
      next: (response) => {
        this.imageId.set(response.imageId);
        this.description.set(response.message);
        this.payAmount.set(response.payableAmount);
        this.guaranteeAmount.set(response.guaranteeAmount);
        this.hintMessage.set(response.note);
        this.pageTitle.set(response.pageTitle);
        this.iban.set(response.iban);
        this.hasRenew.set(response.hasRenew);

        if (response.mandatoryFields.some((item) => item === 'iban')) {
          this.ibanRequired.set(true);
        }

        if (this.fieldErrors()?.length) {
          this.bottomSheetService.openBottomSheet(
            CreditNoServiceDialogComponent,
            {
              title: 'خطا',
              message: this.fieldErrors()![0].text,
              staticImage: 'error',
              secondaryCta: 'متوجه شدم',
              notBlocker: true,
            },
            {
              height: '100%',
            },
          );
        }

        this.gettingData.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.onBack();
      },
    });
  }

  onBack(): void {
    this.back.emit();
  }

  onFinish(): void {
    this.finish.emit();
  }
}
