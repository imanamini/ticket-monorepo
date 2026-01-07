import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BankCard, MobileDatePickerComponent } from '@client-monorepo/daily-fintech/bank-card';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { CommonModule } from '@angular/common';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'c2c-applet-card-edit-bottom-sheet',
  standalone: true,
  imports: [CommonModule, UiFormFieldBuilderModule, ReactiveFormsModule, MobileDatePickerComponent, NgxButtonComponent],
  templateUrl: './card-edit-bottom-sheet.component.html',
  styleUrls: ['./card-edit-bottom-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardEditBottomSheetComponent {
  private readonly bottomSheetService = inject(NgxBottomSheetService);
  private readonly formBuilder = inject(UntypedFormBuilder);

  data = computed(() => this.bottomSheetService.data);
  card = computed<BankCard>(() => this.bottomSheetService.data().card);
  type = computed<'source' | 'destination'>(() => this.bottomSheetService.data().type);

  displayingDatePicker = signal(false);

  form: UntypedFormGroup;

  constructor() {
    if (this.type() === 'source') {
      this.form = this.formBuilder.group({
        alias: [this.card()?.alias, Validators.required],
        expireDate: [this.card().expireDate, Validators.required],
      });
    } else {
      this.form = this.formBuilder.group({
        alias: [this.card().alias, Validators.required],
      });
    }
  }
  close() {
    this.bottomSheetService.outputData.set({ confirmed: false });
    this.bottomSheetService.closeBottomSheet();
  }

  save() {
    if (this.form.valid) {
      const expireDate = this.form.controls['expireDate'] ? this.form.controls['expireDate'].value : null;
      this.bottomSheetService.outputData.set({ confirmed: true, alias: this.form.controls['alias'].value?.trim(), expireDate });
      this.bottomSheetService.closeBottomSheet();
    }
  }

  expirationDateKeydown($event: Event) {
    $event.preventDefault();
  }

  confirmDateSelection(date: { timestamp: number; date: string }) {
    this.form.controls['expireDate'].setValue(date.date);
    this.displayingDatePicker.set(false);
  }

  expirationDateClick(): void {
    this.displayingDatePicker.set(true);
  }

  hideDatePicker(): void {
    this.displayingDatePicker.set(false);
  }
}
