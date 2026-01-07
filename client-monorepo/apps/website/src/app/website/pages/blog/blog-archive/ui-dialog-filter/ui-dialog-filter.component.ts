import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ArchiveFilters } from '../../../../../api/digipay/models/blog/archive-filters.model';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';

@Component({
  selector: 'app-ui-dialog-filter',
  templateUrl: './ui-dialog-filter.component.html',
  styleUrls: ['./ui-dialog-filter.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, UiButtonComponent, CategoryFilterComponent],
})
export class UiDialogFilterComponent implements OnInit {
  xDown: number = null;
  yDown: number = null;

  isExtraOpen = false;

  filters: ArchiveFilters;

  selectedCategoryId: string;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetDialogData: any,
    private bottomSheetRef: MatBottomSheetRef,
    private changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {
    this.filters = this.bottomSheetDialogData.filters;
    this.selectedCategoryId = this.bottomSheetDialogData.selectedCategoryId;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById('swipe-btn');
      this._ngZone.runOutsideAngular(() => {
        element.addEventListener(
          'touchstart',
          (te) => {
            te.stopPropagation();
            this._ngZone.run((e) => {
              this.handleTouchStart(te);
            });
          },
          false,
        );
        element.addEventListener('touchmove', (et) => {
          et.stopPropagation();
          this._ngZone.run((e) => {
            this.handleTouchMove(et);
          });
        });
      });
    }
  }

  handleTouchStart(evt) {
    const firstTouch = evt.targetTouches;
    this.xDown = firstTouch[0].clientX;
    this.yDown = firstTouch[0].clientY;
  }

  handleTouchMove(evt) {
    if (!this.xDown || !this.yDown) {
      return;
    }
    const yUp = evt.touches[0].clientY;
    const yDiff = this.yDown - yUp;
    if (yDiff > 0) {
      if (!this.isExtraOpen) {
        this.isExtraOpen = true;
        this.changeDetectorRef.detectChanges();
      }
    } else {
      if (this.isExtraOpen) {
        this.isExtraOpen = false;
      } else {
        this.bottomSheetRef.dismiss();
      }
    }
    this.xDown = null;
    this.yDown = null;
  }

  selectCategory(categoryId: string) {
    this.selectedCategoryId = categoryId;
  }

  submitFilters() {
    this.bottomSheetRef.dismiss(this.selectedCategoryId);
  }
}
