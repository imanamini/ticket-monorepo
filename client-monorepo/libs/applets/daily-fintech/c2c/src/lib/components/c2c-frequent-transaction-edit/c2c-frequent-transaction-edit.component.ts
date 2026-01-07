import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { HorizontalScrollComponent } from '@client-monorepo/common/ui-components';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { C2cMainService } from '../../data-access/services/c2c-main.service';
import { ModifiedC2cFrequentTransaction } from '../../data-access/models/c2c-frequent-transaction-response';
import { C2cStateService } from '../../data-access/services/c2c-state.service';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { C2C_FREQUENT_TRANSACTION_ICON_NAME_MAPPING } from '../../data-access/constants/c2c-frequent-transaction-icons-mapping';

@Component({
  selector: 'c2c-applet-c2c-frequent-transaction-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    ApiImageModule,
    HorizontalScrollComponent,
    NgxButtonComponent,
    DpIconComponent,
  ],
  templateUrl: './c2c-frequent-transaction-edit.component.html',
  styleUrls: ['./c2c-frequent-transaction-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C2cFrequentTransactionEditComponent implements OnInit {
  // Injects
  private c2cMainService = inject(C2cMainService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private c2cStateService = inject(C2cStateService);
  private formBuilder = inject(UntypedFormBuilder);

  frequentTransaction = computed<ModifiedC2cFrequentTransaction>(() => this.bottomSheetService.data());
  iconsList = computed<string[]>(() => this.c2cStateService.c2cFrequentTransactionsConfig()?.icons || []);

  spinner = signal(false);
  selectedIcon = signal('');

  form: UntypedFormGroup;

  constructor() {
    this.form = this.formBuilder.group({
      alias: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.onSelectIcon(this.frequentTransaction().iconId);
    this.initializeForm();
  }

  /**
   * Initialize form with current transaction data
   */
  private initializeForm(): void {
    this.form.controls['alias'].patchValue(this.frequentTransaction().title);
  }

  /**
   * Handle icon selection with proper state management
   */
  onSelectIcon(iconId: string): void {
    this.selectedIcon.set(iconId);
  }

  save() {
    if (this.spinner() || this.form.invalid) {
      return;
    }
    this.spinner.set(true);

    const data = {
      alias: this.form.controls['alias'].value,
      amount: this.frequentTransaction().amount,
      iconId: this.selectedIcon(),
      id: this.frequentTransaction().id,
      pinned: true,
    };
    this.c2cMainService.handleEditFrequentTransaction(data).subscribe({
      next: () => {
        this.spinner.set(false);
        this.close();
      },
      error: () => {
        this.spinner.set(false);
      },
    });
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }

  protected readonly C2C_FREQUENT_TRANSACTION_ICON_NAME_MAPPING = C2C_FREQUENT_TRANSACTION_ICON_NAME_MAPPING;
}
