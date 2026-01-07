import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BaseLayoutComponent } from './base-layout/base-layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';

import { UiBottomSheetsModule } from '../../ui/ui-components/ui-bottom-sheets/ui-bottom-sheets.module';

import { DownloadAppLinkDirective } from '../../ui/ui-directive/download-app-link.directive';

@NgModule({
  exports: [BaseLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    UiBottomSheetsModule,
    NgOptimizedImage,
    DownloadAppLinkDirective,
    BaseLayoutComponent,
    HeaderComponent,
    FooterComponent,
  ],
})
export class LayoutModule {}
