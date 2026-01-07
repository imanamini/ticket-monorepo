import { inject, Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PageEnum } from '../enums/page.enum';
import { UrlService } from './url.service';

@Injectable()
export class BottomSheetService {
  private disableCloseBottomSheet = false;
  private bottomSheet = inject(MatBottomSheet);
  private urlService = inject(UrlService);

  public open(component): void {
    const bottomSheetRef = this.bottomSheet.open(component, {
      panelClass: 'tgs-bottom-sheet',
      disableClose: this.disableCloseBottomSheet
    });
    this.afterDismiss(bottomSheetRef);
  }

  private afterDismiss(bottomSheetRef): void {
    bottomSheetRef.afterDismissed().subscribe(() => {
      // We have to call this operation inside setTimeout function so that when we click the back button of the browser,
      // we can recognize the current page before changing the state.
      setTimeout(() => {
        this.urlService.addPageToQueryParam(PageEnum.PAYMENT_METHOD); // every time after close bottom sheet, we have payment method page as current page.
      }, 0);
    });
  }

  public close(): void {
    this.bottomSheet.dismiss();
  }

  public updateDisableCloseFlag(): void {
    this.disableCloseBottomSheet = true;
  }
}
