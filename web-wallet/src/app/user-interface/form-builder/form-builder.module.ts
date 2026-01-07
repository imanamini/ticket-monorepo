import { NgModule } from '@angular/core';
import { FBFieldComponent } from './fb-field/fb-field.component';
import { FbInputDirective } from './fb-field/directives/fb-input.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    FBFieldComponent,
    FbInputDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FbInputDirective,
    FBFieldComponent
  ]
})
export class FormBuilderModule {
}
