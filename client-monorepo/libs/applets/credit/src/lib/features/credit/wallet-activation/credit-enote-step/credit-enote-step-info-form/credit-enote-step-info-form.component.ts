import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { MessageService } from '../../../data-access/services/message.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { isValidIBANNumber } from '../../../data-access/utils/strings';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxStateService } from '@digipay/ngx-status-result';
import { CreditEnoteStateType } from '../models/credit-enote-result';
import { CreditEnoteStepErrorComponent } from '../credit-enote-step-error/credit-enote-step-error.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';

@Component({
  selector: 'app-credit-enote-step-info-form',
  templateUrl: './credit-enote-step-info-form.component.html',
  styleUrls: ['./credit-enote-step-info-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgxCalloutComponent,
    NgxButtonComponent,
    PipesModule,
    CreditEnoteStepErrorComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    UiFormFieldBuilderModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEnoteStepInfoFormComponent implements OnInit {
  hasRenew = input(false);
  creditId = input.required<string>();

  switchTypePossible = input<boolean>();

  pageTitle = input<string>();

  imageId = input<string>();

  payAmount = input<number>();

  fieldErrors = input<{ fieldName: string; text: string }[]>();

  description = input<string>();

  hintMessage = input<{
    title: string;
    description: string;
  }>();

  iban = input<string>();

  changeNoteTypeClicked = output<void>();

  goToSana = output<void>();

  back = output<void>();

  finish = output<void>();
  form!: FormGroup;
  focusField = {
    iban: false,
  };

  submittingData = signal<boolean | null>(null);
  errorState = signal<CreditEnoteStateType>(null);
  invalidIbans: string[] = [];
  ibanServerErrorMessage = '';

  formBuilder = inject(FormBuilder);
  messageService = inject(MessageService);
  creditApiService = inject(CreditApiService);
  bottomSheetService = inject(NgxBottomSheetService);
  ngxStateService = inject(NgxStateService);

  ngOnInit(): void {
    this.createForm({ iban: this.iban() || '' });

    /*reason this code => Fixed bug of ui-form-field package*/
    this.form.get('iban')?.valueChanges.subscribe((res: string) => {
      if (res.length > 26) {
        this.form.get('iban')?.setValue(res.substring(0, 26));
      }
    });
  }

  createForm(preFillData: { iban: string }): void {
    this.form = this.formBuilder.group({
      iban: [
        preFillData.iban,
        [Validators.required, Validators.pattern(/IR\d{24}$/i), this.serverIbanValidator.bind(this), this.ibanChecksumValidator.bind(this)],
      ],
    });
    if (preFillData.iban) {
      this.form.controls['iban'].markAsTouched();
    }
  }

  onBack(): void {
    this.back.emit();
  }

  notifyLimit(): void {
    if (!this.hasRenew()) {
      this.ngxStateService.openBottomSheet(
        {
          title: 'مرحله صدور سفته و امضای اسناد را تا ساعت ۲۴ همان روز انجام دهید.',
          description: 'در غیر این صورت دوباره برای صدور سفته اقدام کنید.',
          icon: 'info',
          type: 'Status',
          buttons: [
            {
              id: 'creditEnoteInfoConfirmButton',
              style: 'fill',
              label: 'متوجه شدم',
              mode: 'form',
              fullWidth: true,
            },
          ],
        },
        { disableClose: true },
      );

      const onClose = this.ngxStateService.onClose().subscribe({
        next: () => {
          onClose.unsubscribe();
          this.submit();
        },
      });
    } else {
      this.submit();
    }
  }

  submit(): void {
    this.submittingData.set(true);
    this.creditApiService.initEnoteStep(this.creditId(), this.cleanIban(this.form.value.iban)).subscribe({
      next: () => {
        this.finish.emit();
      },
      error: (error) => {
        if (this.messageService.isNoServiceError(error)) {
          this.errorState.set('ENOTE_ERROR');
          return;
        } else if (this.messageService.isNoSignUpSana(error)) {
          this.errorState.set('SANA_NOT_REGISTERED');
          return;
        }
        this.messageService.showErrorOfErrorResponse(error);
        this.submittingData.set(false);
        this.finish.emit();
      },
    });
  }

  ibanChecksumValidator(control: FormControl): { [p: string]: boolean } | null {
    if (isValidIBANNumber(this.cleanIban(control.value))) {
      return null;
    }
    return { invalidIban: true };
  }

  serverIbanValidator(control: FormControl): { [p: string]: boolean } | null {
    if (this.invalidIbans.indexOf(this.cleanIban(control.value)) < 0) {
      return null;
    }
    return { serverError: true };
  }

  retry() {
    this.errorState.set(null);
    this.submittingData.set(false);
  }

  private cleanIban(value: string) {
    if (!value) {
      return value;
    }
    return value.replace('-', '').replace(/\s/gi, '');
  }
}
