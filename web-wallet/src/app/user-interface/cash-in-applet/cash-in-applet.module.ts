import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashInAppletComponent } from './cash-in-applet.component';
import { UserInterfaceModule } from '../user-interface.module';

@NgModule({
  declarations: [
    CashInAppletComponent,
  ],
  imports: [
    CommonModule,
    UserInterfaceModule
  ],
  exports: [
    CashInAppletComponent
  ]
})
export class CashInAppletModule {
}
