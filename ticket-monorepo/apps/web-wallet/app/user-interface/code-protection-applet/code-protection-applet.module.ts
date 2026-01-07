import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeProtectionAppletComponent } from './code-protection-applet.component';
import { UserInterfaceModule } from '../user-interface.module';
import { PasswordTypePipe } from './password-type.pipe';

@NgModule({
  declarations: [
    CodeProtectionAppletComponent,
    PasswordTypePipe
  ],
  imports: [
    CommonModule,
    UserInterfaceModule
  ],
  exports: [
    CodeProtectionAppletComponent
  ]
})
export class CodeProtectionAppletModule {
}
