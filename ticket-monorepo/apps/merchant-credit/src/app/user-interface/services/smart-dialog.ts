import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {  MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SmartDialog {

  isDesktop = false;

  last: any;

  data: any;

  constructor(
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) {
    this.isDesktop = window.matchMedia('(min-width: 768px)').matches;
  }

  open(component: any, data: any = {}): Promise<any> {
    const reference: any = this.isDesktop ? this.dialog : this.bottomSheet;
    const referenceWidth = this.isDesktop ? '376px' : '100%';
    this.data = data;
    this.last = reference.open(component, {
      data,
      panelClass: ['digipay-dialog-sheet'],
      width: referenceWidth,
      maxWidth: '90%',
    });

    let sub: Observable<any>;
    if (this.last instanceof MatBottomSheetRef) {
      sub = this.last.afterDismissed();
    }
    if (this.last instanceof MatDialogRef) {
      sub = this.last.afterClosed();
    }
    return new Promise<any>(resolve => {
      sub.subscribe(result => {
        resolve(result);
      });
    });
  }

  close(result: any = null): void {
    if (this.last.close && typeof this.last.close === 'function') {
      return this.last.close(result);
    }
    if (this.last.dismiss && typeof this.last.dismiss === 'function') {
      this.last.dismiss(result);
    }
  }
}
