import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { InitPhysicalNotePayload } from '../../../../data-access/models/credit/activation/enote-step/init-physical-note-payload';
import { MessageService } from '../../../../data-access/services/message.service';
import { CreditNoteSerialInputComponent } from '../../credit-note-serial-input/credit-note-serial-input.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-credit-physical-enote-step-register',
  templateUrl: './credit-physical-enote-step-register.component.html',
  styleUrls: ['./credit-physical-enote-step-register.component.scss', '../../credit-enote.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CreditNoteSerialInputComponent,
    NgxButtonComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    UiFormFieldBuilderModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPhysicalEnoteStepRegisterComponent implements OnInit {
  creditId = input.required<string>();
  switchTypePossible = input<boolean>();

  nextStep = output<void>();
  prevStep = output<void>();
  changeNoteTypeClicked = output<void>();

  showLoading = signal(false);
  form!: FormGroup;
  VALIDATION_RULES = {
    treasuryNumber: [Validators.required],
    series: [Validators.required, this.seriesValidator()],
  };

  private formBuilder = inject(FormBuilder);
  private apiService = inject(CreditApiService);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.makeForm();
  }

  seriesValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === '_/_') {
        return { bothEmpty: true };
      }
      return null;
    };
  }

  makeForm() {
    this.form = this.formBuilder.group({
      treasuryNumber: [null, this.VALIDATION_RULES.treasuryNumber],
      series: ['', this.VALIDATION_RULES.series],
    });

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.cdr.detectChanges();
      },
    });
  }

  onSubmit() {
    const payload: InitPhysicalNotePayload = {
      creditId: this.creditId(),
      treasuryNumber: this.form.value.treasuryNumber,
      series: this.form.value.series,
    };
    this.showLoading.set(true);
    this.apiService.initPhysicalNote(payload).subscribe({
      next: () => {
        this.showLoading.set(false);
        this.nextStep.emit();
      },
      error: (e) => {
        this.showLoading.set(false);
        this.messageService.showErrorOfErrorResponse(e);
      },
    });
  }
}
