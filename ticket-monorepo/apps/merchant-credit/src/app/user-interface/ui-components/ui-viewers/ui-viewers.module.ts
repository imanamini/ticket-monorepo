import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiPdfViewerComponent } from './ui-pdf-viewer/ui-pdf-viewer.component';
import { MatIconModule } from '@angular/material/icon';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {  MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    UiPdfViewerComponent
  ],
  exports: [
    UiPdfViewerComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    PdfViewerModule,
    MatProgressSpinnerModule
  ]
})
export class UiViewersModule { }
