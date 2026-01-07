import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnInit,
  output,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { convertNonEnglishDigits } from '@digipay/strings';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditGenerateDigitalSignatureInfoCharacterSelectionBottomSheetComponent } from '../credit-generate-digital-signature-info-character-selection-bottom-sheet/credit-generate-digital-signature-info-character-selection-bottom-sheet.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditStepperComponent } from '../../../../components/credit-stepper/credit-stepper.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';

@Component({
  selector: 'app-credit-generate-digital-signature-national-card',
  templateUrl: './credit-generate-digital-signature-national-card.component.html',
  styleUrl: './credit-generate-digital-signature-national-card.component.scss',
  imports: [
    NgxSkeletonLoadingComponent,
    ReactiveFormsModule,
    NgxButtonComponent,
    NgxTrackableIdDirective,
    CreditAppBarComponent,
    CreditStepperComponent,
    CreditScrollableViewComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureNationalCardComponent implements OnInit, AfterViewInit {
  hintMessage = 'سریال شامل نه رقم و یک حرف لاتین است';
  errorMessage = signal('');

  form!: FormGroup;

  back = output<void>();
  serialNumberEntered = output<string>();
  haveNoNationalCard = output<void>();
  serialNumberInput = model<string>('');
  step = input<number>();
  totalSteps = input<number>();
  loading = input<boolean>(false);
  currentState = input<string>();
  @ViewChildren('inputs') inputs: QueryList<ElementRef<HTMLInputElement>> | undefined;
  inputGroups = [
    {
      autocapitalize: 'none',
      class: 'single-number',
      formControlName: 'singleNumber',
      maxlength: 1,
      pattern: '[0-9]*',
      placeholder: '0',
      type: 'text',
      inputMode: 'numeric',
      readonly: false,
    },
    {
      autocapitalize: 'characters',
      class: 'single-character',
      formControlName: 'singleCharacter',
      maxlength: 1,
      pattern: '',
      placeholder: 'P',
      type: 'text',
      inputMode: 'text',
      readonly: true,
    },
    {
      autocapitalize: 'none',
      class: 'serial-number',
      formControlName: 'serialNumber',
      maxlength: 8,
      pattern: '[0-9]*',
      placeholder: '۷۸۳۶۷۵۸۷',
      type: 'text',
      inputMode: 'numeric',
      readonly: false,
    },
  ];
  inputElements!: ElementRef<HTMLInputElement>[] | null;

  bottomSheetService = inject(NgxBottomSheetService);

  constructor(private formBuilder: FormBuilder) {
    effect(() => {
      if (this.currentState() === 'NATIONAL_CARD') {
        this.scrollToForm();
      }
    });
  }

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    this.inputElements = this.inputs?.toArray()!;
  }

  initForm() {
    if (!isNaN(+this.serialNumberInput())) {
      this.serialNumberInput.set('');
    }

    this.form = this.formBuilder.group({
      singleNumber: [this.serialNumberInput()?.substring(0, 1) || '', Validators.required],
      singleCharacter: [this.serialNumberInput()?.substring(1, 2) || '', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      serialNumber: [this.serialNumberInput()?.substring(2, 10) || '', [Validators.required, Validators.minLength(8)]],
    });

    this.form.controls['singleNumber'].valueChanges.subscribe({
      next: (value) => {
        this.onChangeSingleNumberInput(value);
      },
    });
    this.form.controls['singleCharacter'].valueChanges.subscribe({
      next: (value) => {
        this.onChangeSingleCharacterInput(value);
      },
    });
    this.form.controls['serialNumber'].valueChanges.subscribe({
      next: (value) => {
        this.onChangeSerialNumberInput(value);
      },
    });
  }

  onBack() {
    this.back.emit();
  }

  onChangeSingleNumberInput(value: string) {
    this.errorMessage.set('');
    const val = this.convertInputToNumber(value);

    if (value !== val && this.form) {
      this.form.controls['singleNumber'].setValue(val, { emitEvent: false });
    }
    if (val && this.inputElements) {
      this.focusInput(this.inputElements[1].nativeElement);
    }
  }

  onChangeSingleCharacterInput(value: string) {
    this.errorMessage.set('');
    if (this.form.controls['singleCharacter'].hasError('pattern')) {
      this.errorMessage.set('دومین کاراکتر باید حروف لاتین باشد.');
      return;
    }
    if (value && value.toUpperCase()) {
      this.form.controls['singleCharacter'].setValue(value.toUpperCase(), {
        emitEvent: false,
      });
    }

    if (value) {
      this.focusInput(this.inputElements![2].nativeElement);
    } else {
      this.focusInput(this.inputElements![0].nativeElement);
    }
  }

  onChangeSerialNumberInput(value: string) {
    this.errorMessage.set('');
    const val = this.convertInputToNumber(value);

    if (value !== val && this.form) {
      this.form.controls['serialNumber'].setValue(val, { emitEvent: false });
    }
    if (this.form.controls['serialNumber'].hasError('minlength')) {
      this.errorMessage.set('این قسمت از سریال باید ۸ رقمی باشد.');
      return;
    }
    if (!value) {
      this.focusInput(this.inputElements![1].nativeElement);
    }
  }

  convertInputToNumber(value: string) {
    const val = convertNonEnglishDigits(value);
    return val.replace(/[^\d]/g, '');
  }

  onOpenBottomSheetCharacters(item: any) {
    if (item.readonly) {
      this.bottomSheetService.openBottomSheet(
        CreditGenerateDigitalSignatureInfoCharacterSelectionBottomSheetComponent,
        {
          character: this.form.controls[item.formControlName].value,
        },
        {
          noPadding: true,
          disableClose: true,
          hasBackgroundColor: false,
        },
      );

      const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe(() => {
        onCloseBottomSheet.unsubscribe();
        const result: any = this.bottomSheetService.outputData();
        this.form.controls[item.formControlName].setValue(result);
      });
    }
  }

  noNationalCard() {
    this.haveNoNationalCard.emit();
  }

  submit() {
    this.serialNumberEntered.emit(
      this.form.controls['singleNumber'].value + this.form.controls['singleCharacter'].value + this.form.controls['serialNumber'].value,
    );
  }

  focusInput(input: HTMLInputElement) {
    input.focus();
    input.select();
  }

  scrollToForm() {
    const El = document.getElementById('form');
    if (El) {
      El.scrollIntoView({
        block: 'center',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  }
}
