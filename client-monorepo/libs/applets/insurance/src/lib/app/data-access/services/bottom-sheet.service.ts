import { inject, Injectable, ViewContainerRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ComponentType } from '@angular/cdk/overlay';
import { MetricService } from './metric.service';

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {

  private bottomSheet = inject(MatBottomSheet);
  private metricService = inject(MetricService);

  open(component: ComponentType<unknown>, data?: { name: string, [key: string]: any }, option: {
    fullPage?: boolean,
    showHolderIcon?: boolean,
    closeOnNavigation?: boolean,
    viewContainer?: ViewContainerRef
  } = {}): MatBottomSheetRef {
    if (data.name) {
      this.metricService.sendMetric(data?.name, null, null);
    }
    option = Object.assign({fullPage: false, showHolderIcon: true, closeOnNavigation: true}, option);
    return this.bottomSheet.open(component, {
      data: {
        ...data,
        fullPage: option.fullPage,
        showHolderIcon: option.showHolderIcon
      },
      autoFocus: 'dialog',
      panelClass: ['third-party-bottom-sheet', option.fullPage ? 'full-page-bottom-sheet' : undefined],
      closeOnNavigation: option.closeOnNavigation,
      viewContainerRef: option.viewContainer
    });
  }

  closeCurrentBottomSheet(data?: any): void {
    this.bottomSheet._openedBottomSheetRef?.dismiss(data);
  }
}
