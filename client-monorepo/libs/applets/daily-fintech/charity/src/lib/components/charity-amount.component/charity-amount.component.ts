import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { Organization } from '../../data-access/models/charity-config.response.model';
import { FramedIconComponent } from '@client-monorepo/common/ui-components';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CharityPurchaseModel } from '../../data-access/models/charity-purchase.model';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'charity-applet-amount.component',
  standalone: true,
  imports: [
    CommonModule,
    ApiImageModule,
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    PipesModule,
    FramedIconComponent,
    NgxButtonComponent,
  ],
  templateUrl: './charity-amount.component.html',
  styleUrl: './charity-amount.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharityAmountComponent {
  sheetData: {
    data: Organization;
  };
  amountForm!: UntypedFormGroup;
  isSubmitting = false;
  imageType = ServiceImagesType.IMAGE_ID;
  selectedAmount = signal(0);

  constructor(
    private bottomSheetService: NgxBottomSheetService,
    private fb: UntypedFormBuilder,
  ) {
    this.amountForm = this.fb.group({
      amount: ['', [Validators.required]],
      formattedAmount: ['', [Validators.required]],
    });
    this.sheetData = this.bottomSheetService.data();
  }

  amountSelected(amount: number) {
    this.amountForm.setValue({
      amount: amount,
      formattedAmount: '',
    });
    this.amountForm.markAsUntouched();
    this.selectedAmount.set(amount);
  }

  continueClicked() {
    const resultCharityBottomSheet: CharityPurchaseModel = {
      amount: this.amountForm.controls['amount'].value,
      organization: this.sheetData.data,
    };
    this.bottomSheetService.outputData.set({
      result: resultCharityBottomSheet,
    });
    this.bottomSheetService.closeBottomSheet();
  }
}
