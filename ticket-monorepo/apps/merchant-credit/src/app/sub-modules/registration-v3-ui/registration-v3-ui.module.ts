import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutHeaderComponent } from './layout-header/layout-header.component';
import { BaseLayoutComponent } from './base-layout/base-layout.component';
import { ApiImageModule } from '@digipay/ng-ui-api-image';

@NgModule({
  declarations: [
    LayoutHeaderComponent,
    BaseLayoutComponent
  ],
  imports: [
    CommonModule,
    ApiImageModule
  ],
  exports: [
    LayoutHeaderComponent,
    BaseLayoutComponent
  ]
})
export class RegistrationV3UiModule {
}
