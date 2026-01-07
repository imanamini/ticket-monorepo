import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiSimCardComponent } from './ui-sim-card/ui-sim-card.component';
import { UiSimCardSelectComponent } from './ui-sim-card-select/ui-sim-card-select.component';
import { UiInternetPackageComponent } from './ui-internet-package/ui-internet-package.component';
import { UiInternetPackagesBoxComponent } from './ui-internet-packages-box/ui-internet-packages-box.component';

import { UiCellNumberFieldModule } from '../../ui-components/ui-cell-number-field/ui-cell-number-field.module';
import { UiInternetPackageConfirmComponent } from './ui-internet-package-confirm/ui-internet-package-confirm.component';

import { UiDialogsModule } from '../../ui-components/ui-dialogs/ui-dialogs.module';

import { PipesModule } from '@digipay/ng-lib-pipes';

@NgModule({
  exports: [
    UiSimCardComponent,
    UiSimCardSelectComponent,
    UiInternetPackagesBoxComponent,
    UiInternetPackageComponent,
    UiInternetPackageConfirmComponent,
  ],
  imports: [
    CommonModule,
    UiCellNumberFieldModule,
    UiDialogsModule,
    PipesModule,
    UiSimCardComponent,
    UiSimCardSelectComponent,
    UiInternetPackageComponent,
    UiInternetPackagesBoxComponent,
    UiInternetPackageConfirmComponent,
  ],
})
export class UiInternetModule {}
