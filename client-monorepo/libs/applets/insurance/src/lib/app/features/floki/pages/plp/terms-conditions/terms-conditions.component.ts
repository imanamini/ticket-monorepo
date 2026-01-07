import { Component, inject, OnInit, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FlokiHeaderComponent } from '../../../ui-component/floki-header/floki-header.component';
import { ApplicationFormService } from '../../../services/application-form.service';
import { BaseComponent } from '../../../../../components/base/base.component';
import { BottomSheetBoxComponent } from '../../../../../components/bottom-sheet-box/bottom-sheet-box.component';

@Component({
  selector: 'terms-conditions',
  standalone: true,
  imports: [FlokiHeaderComponent, NgxButtonComponent],
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.scss',
})
export class TermsConditionsComponent extends BaseComponent implements OnInit {
  termsAndConditions = signal<string>('');
  bottomSheetData = inject(MAT_BOTTOM_SHEET_DATA);
  applicationFormService = inject(ApplicationFormService);
  private bottomSheetRef = inject(MatBottomSheetRef<BottomSheetBoxComponent>);

  ngOnInit(): void {
    this.getTermsAndConditions();
  }

  getTermsAndConditions(): void {
    const bottomSheetData = this.bottomSheetData.data;
    const subscription = this.applicationFormService.getTermsAndConditions(bottomSheetData?.appId, bottomSheetData?.productId).subscribe({
      next: (res) => {},
      error: (error) => {},
    });
    super.addSubscription(subscription);
  }

  closeBottomSheet(): void {
    this.bottomSheetRef.dismiss();
  }

  goBack(): void {
    console.log(this.bottomSheetData, 'Bottom sheet');
  }
}
