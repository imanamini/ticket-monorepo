import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Overlay } from '@angular/cdk/overlay';
import { isMobileOrTablet } from '../../../utils/device';

@Injectable({
  providedIn: 'root'
})
export class SmartDropDownService {

  /**
   * Used in components to tell service to close the dropdown/bottom-sheet
   */
  shouldClose: Subject<{
    confirmed: boolean,
    data: any,
  }> = new Subject();

  /**
   * Used for broadcasting the result
   */
  private result: Subject<{
    confirmed: boolean,
    data: any,
  }> = new Subject();

  /**
   * Hold the data for bottom-sheet/dropdown initialization
   */
  data: Subject<any> = new BehaviorSubject({});

  /**
   * Hold the bottom sheet reference
   */
  bottomSheetRef: MatBottomSheetRef<any>;

  /**
   * Close subscription
   */
  closeSubscription: Subscription = null;

  /**
   * Tells when dropdown should be opened
   */
  openDropDown: Subject<boolean> = new Subject();

  /**
   * Close signal that sent from components for inter-component communications
   * (e.g: select tells dropdown to close)
   */
  closeSignal: Subject<boolean> = new Subject();

  /**
   * Sometimes it is necessary to have real-time updates about data changes
   * inside of the picker/select components.
   * Subscribe to this subject to get real-time updates.
   */
  dataChanged: Subject<any> = new Subject();

  /**
   *
   * @param matDialog
   * @param matBottomSheet
   * @param overlay
   * @param componentFactoryResolver
   */
  constructor(
    private matDialog: MatDialog,
    private matBottomSheet: MatBottomSheet,
    private overlay: Overlay,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  /**
   * Opens a component inside a bottom sheet or a dialog
   *
   * @param component
   * @param data
   */
  open(component: any, data: any): Observable<any> {
    let view = '';

    this.data.next(data);

    if (!isMobileOrTablet()) {
      this.openDropDown.next(true);
    } else {
      view = 'bottom-sheet';
      this.bottomSheetRef = this.matBottomSheet.open(component, {
        panelClass: ['smart-drop-down', 'digipay-bottom-sheet', 'is-bottom-sheet']
      });
    }

    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }

    this.closeSubscription = this.shouldClose.subscribe(result => {
      if (view === 'bottom-sheet') {
        this.bottomSheetRef.dismiss();
      } else {
        this.openDropDown.next(false);
      }

      this.result.next(result);
    });

    return this.result.asObservable();
  }

  clear() {
    this.data.next({});
  }
}
