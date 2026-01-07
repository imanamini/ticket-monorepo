import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageDialogComponent } from './page-dialog.component';

@NgModule({
  declarations: [PageDialogComponent],
  exports: [PageDialogComponent],
  imports: [CommonModule],
})
export class PageDialogModule {}
