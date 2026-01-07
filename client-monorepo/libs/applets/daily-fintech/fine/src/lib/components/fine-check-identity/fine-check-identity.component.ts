import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FineApiService, FineIdentityCheckUser, VehicleType } from '@client-monorepo/daily-fintech/vehicle-data';
import { ActivatedRoute } from '@angular/router';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'fine-applet-check-identity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiFormFieldBuilderModule, NgxButtonComponent],
  templateUrl: './fine-check-identity.component.html',
  styleUrl: './fine-check-identity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FineCheckIdentityComponent {
  bottomSheetService = inject(NgxBottomSheetService);
  fineApiService = inject(FineApiService);
  route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  identityForm!: UntypedFormGroup;
  sheetData: {
    phoneNumber?: string;
    nationalCode?: string;
    plateNo: string;
  };

  constructor(private fb: UntypedFormBuilder) {
    this.identityForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.minLength(11)]],
      nationalCode: ['', [Validators.required, Validators.minLength(10)]],
    });
    this.sheetData = this.bottomSheetService.data();
    if (this.sheetData.phoneNumber && this.sheetData.nationalCode) {
      this.identityForm.controls['phoneNumber'].setValue(this.sheetData.phoneNumber);
      this.identityForm.controls['nationalCode'].setValue(this.sheetData.nationalCode);
    }
  }

  onSubmitClicked() {
    const user: FineIdentityCheckUser = {
      cellNumber: this.identityForm.controls['phoneNumber'].value,
      nationalCode: this.identityForm.controls['nationalCode'].value,
      vehicleType: VehicleType.CAR,
    };
    this.fineApiService
      .identityCheck(this.sheetData.plateNo, user)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.bottomSheetService.outputData.set({
            result: data,
            cellNumber: this.identityForm.controls['phoneNumber'].value,
            nationalCode: this.identityForm.controls['nationalCode'].value,
          });
        },
        error: (error: any) => {
          if (error.status === 422) {
            this.bottomSheetService.outputData.set({
              error: error,
              cellNumber: this.identityForm.controls['phoneNumber'].value,
              nationalCode: this.identityForm.controls['nationalCode'].value,
            });
          }
          this.bottomSheetService.closeBottomSheet();
        },
      });
  }
}
