import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { DailyFintechRecommendationItemComponent, RecommendationData } from '@client-monorepo/daily-fintech/recommendation';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'daily-fintech-recommendation-edit',
  standalone: true,
  imports: [CommonModule, DailyFintechRecommendationItemComponent, ReactiveFormsModule, UiFormFieldBuilderModule, NgxButtonComponent],
  templateUrl: './daily-fintech-recommendation-edit.component.html',
  styleUrls: ['./daily-fintech-recommendation-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyFintechRecommendationEditComponent {
  cellNumber!: RecommendationData;

  form: UntypedFormGroup;

  initialized = true;

  constructor(
    private bottomSheetService: NgxBottomSheetService,
    private formBuilder: FormBuilder,
  ) {
    if (this.bottomSheetService.data().cellNumber) {
      this.cellNumber = this.bottomSheetService.data().cellNumber;
    }

    this.form = this.formBuilder.group({
      name: [this.cellNumber.title, [Validators.required]],
    });
  }

  closeDialog() {
    this.bottomSheetService.outputData.set({ submit: false });
    this.bottomSheetService.closeBottomSheet();
  }

  confirmDialog(result: any) {
    if (result && this.form.invalid) {
      return;
    }
    this.bottomSheetService.outputData.set({
      submit: result,
      alias: this.form.controls['name'].value,
    });
    this.bottomSheetService.closeBottomSheet();
  }
}
