import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HandleBottomSheetComponent } from './handle-bottom-sheet/handle-bottom-sheet.component';
import { UiBottomSheetLoginComponent } from './ui-bottom-sheet-login/ui-bottom-sheet-login.component';
import { UiBottomSheetComponent } from './ui-bottom-sheet/ui-bottom-sheet.component';

@NgModule({
  exports: [
    UiBottomSheetComponent,
    // UiBottomSheetLoginComponent,
    // UiBottomSheetComponent,
    // HandleBottomSheetComponent
  ],
  imports: [CommonModule, HandleBottomSheetComponent, UiBottomSheetLoginComponent, UiBottomSheetComponent],
})
export class UiBottomSheetsModule {}
