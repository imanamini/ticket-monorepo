import { Component, computed, inject } from '@angular/core';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxListItemComponent } from '@digipay/ngx-list-item';
import { InsuranceUrlsEnum } from '../../../../data-access/enums/insurance-urls.enum';
import { Router } from '@angular/router';
import { FaqCategoryTypeEnum } from '../../../../data-access/enums/faq-category-type.enum';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { INSURANCE_APP_PREFIX } from '../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'support-bottom-sheet',
  standalone: true,
  imports: [
    NgxDividerComponent,
    NgxIcon,
    NgxListItemComponent
  ],
  templateUrl: './support-bottom-sheet.component.html',
  styleUrl: './support-bottom-sheet.component.scss'
})
export class SupportBottomSheetComponent {
  private readonly category: FaqCategoryTypeEnum;
  private router = inject(Router);
  protected readonly BorderColorsEnum = BorderColorsEnum;
  private bottomSheetData = inject(MAT_BOTTOM_SHEET_DATA);
  public phoneNumber = computed<string>(() => {
    switch (this.category) {
      case FaqCategoryTypeEnum.THIRD_PARTY_BODY:
        return 'tel:+982183855820';
      default:
        return 'tel:+982153924000';
    }
  });

  constructor() {
    this.category = this.bottomSheetData.data.category;
  }

  navigateToFaq(): void {
    this.router.navigate([INSURANCE_APP_PREFIX + '/' + InsuranceUrlsEnum.Faq], {
      queryParams: {
        category: this.category
      }
    });
  }

  navigateToTermsAndCondition(): void {
    this.router.navigate([INSURANCE_APP_PREFIX + '/' + InsuranceUrlsEnum.TermsAndCondition], {
      queryParamsHandling: 'preserve'
    });
  }
}
