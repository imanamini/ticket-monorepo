import { inject, Injectable } from '@angular/core';

import { BottomSheetBoxComponent } from '../../components/bottom-sheet-box/bottom-sheet-box.component';
import { BottomSheetService } from './bottom-sheet.service';
import {
  SupportBottomSheetComponent
} from '../../features/house-incidents/components/support-bottom-sheet/support-bottom-sheet.component';
import { FaqCategoryTypeEnum } from '../enums/faq-category-type.enum';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class FaqService {
  private bottomSheetService = inject(BottomSheetService);
  private router = inject(Router);

  open(faqCategoryType: FaqCategoryTypeEnum): void {
    this.router.navigate([], {
      fragment: 'faq',
    }).then(() => {
      this.bottomSheetService.open(BottomSheetBoxComponent, {
        component: SupportBottomSheetComponent,
        name: 'SupportBottomSheetComponent',
        title: 'پشتیبانی',
        data: {
          category: faqCategoryType
        }
      }, {
        showHolderIcon: false,
      }).afterDismissed().subscribe({
        next: () => {
          this.router.navigate([], {
            fragment: null,
            replaceUrl: true
          });
        }
      });
    });
  }
}
