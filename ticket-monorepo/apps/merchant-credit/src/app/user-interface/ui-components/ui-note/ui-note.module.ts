import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiNoteBoxComponent } from './ui-note-box/ui-note-box.component';



@NgModule({
  declarations: [
    UiNoteBoxComponent
  ],
  exports: [
    UiNoteBoxComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UiNoteModule { }
