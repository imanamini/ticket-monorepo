import { Component, inject, OnInit, signal } from '@angular/core';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ApplicationFormService } from '../../services/application-form.service';
import { ApplicationFormModel } from '../../models/application-form.model';
import { RialToTomanPipe } from '../../../../pipes/convert-rial-to-toman.pipe';
import { BaseComponent } from '../../../../components/base/base.component';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'edit-device-value',
  standalone: true,
  imports: [NgxDividerComponent, UiFormFieldBuilderModule, ReactiveFormsModule, NgxButtonComponent, RialToTomanPipe],
  templateUrl: './edit-device-value.component.html',
  styleUrl: './edit-device-value.component.scss',
})
export class EditDeviceValueComponent extends BaseComponent implements OnInit {
  bottomSheet = inject(MatBottomSheetRef);
  private bottomSheetData = inject(MAT_BOTTOM_SHEET_DATA);
  applicationFormService = inject(ApplicationFormService);
  messageService = inject(MessageService);
  assetPrice: FormControl<number>;
  isSubmitting = signal<boolean>(false);
  protected readonly BorderColorsEnum = BorderColorsEnum;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.setFormControls();
  }

  public closeModal(item?: ApplicationFormModel): void {
    this.bottomSheet.dismiss(item);
  }

  setFormControls(): void {
    this.assetPrice = new FormControl<number>(null, [Validators.required, Validators.min(10_000_000), Validators.max(1_700_000_000)]);
  }

  updateValue(): void {
    if (this.assetPrice.valid) {
      const subscription = this.applicationFormService
        .patchApplicationForm({
          assetPrice: +this.assetPrice.value,
          applicationFormId: this.bottomSheetData.data.formId,
        })
        .subscribe({
          next: (res) => {
            this.isSubmitting.set(false);
            this.closeModal(res.result);
          },
          error: (e) => {
            this.isSubmitting.set(false);
            //  this.messageService.showErrorInFloki(e);
          },
        });
      super.addSubscription(subscription);
    }
  }
}
