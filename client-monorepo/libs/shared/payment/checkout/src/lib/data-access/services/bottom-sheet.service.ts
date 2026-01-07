import { inject, Injectable } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {
  private disableCloseBottomSheet = false;
  private bottomSheet = inject(NgxBottomSheetService);

  public open(component: any): void {
    const bottomSheetRef = this.bottomSheet.openBottomSheet(component, {});
    this.afterDismiss(bottomSheetRef);
  }

  private afterDismiss(bottomSheetRef: any): void {
    bottomSheetRef.afterDismissed().subscribe(() => {
      // We have to call this operation inside setTimeout function so that when we click the back button of the browser,
      // we can recognize the current page before changing the state.
    });
  }

  public close(): void {
    this.bottomSheet.closeBottomSheet();
  }

  public updateDisableCloseFlag(): void {
    this.disableCloseBottomSheet = true;
  }
}
