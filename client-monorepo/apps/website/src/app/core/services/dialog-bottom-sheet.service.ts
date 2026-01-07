import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { LayoutService } from '../../website/services/layout.service';
import { ScreenSize } from '../../api/digipay/models/common/screen-size';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogBottomSheetService {
  last: any;

  data: any;

  afterCloseData: BehaviorSubject<any> = new BehaviorSubject(null);

  isMobile = false;

  constructor(
    private layoutService: LayoutService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
  ) {
    this.layoutService.screenSizeChanged.subscribe((screenSize) => (this.isMobile = screenSize === ScreenSize.isMobile));
  }

  open(component, data: any): Promise<any> {
    this.afterCloseData.next(null);
    this.data = data;
    const referenceHeight = this.isMobile && data.fullHeightBottomSheet ? '100%' : null;
    const reference: any = this.isMobile ? this.bottomSheet : this.dialog;
    const referenceWidth = this.isMobile ? '100%' : data.width ? data.width : '400px';
    this.last = reference.open(component, {
      data,
      width: referenceWidth,
      height: data.height ? data.height : referenceHeight,
      maxHeight: data.fullHeightBottomSheet ? 'unset' : null,
      panelClass: data.fullHeightBottomSheet ? 'full-height' : null,
    });

    let sub: Observable<any>;
    if (this.last instanceof MatBottomSheetRef) {
      sub = this.last.afterDismissed();
    }
    if (this.last instanceof MatDialogRef) {
      sub = this.last.afterClosed();
    }
    return new Promise<any>((resolve) => {
      sub.subscribe((result) => {
        resolve(result);
      });
    });
  }

  close(result?): void {
    this.afterCloseData.next(result);
    if (this.last.close && typeof this.last.close === 'function') {
      return this.last.close(result);
    }
    if (this.last.dismiss && typeof this.last.dismiss === 'function') {
      this.last.dismiss(result);
    }
  }
}
