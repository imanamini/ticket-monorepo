import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RulesSelectionRoutingModule } from './rules-selection-routing.module';
import { RulesSelectionComponent } from './rules-selection.component';
import { RegistrationUiModule } from '../../sub-modules/registration-ui/registration-ui.module';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';
import { CoreModule } from '../../core/core.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    RulesSelectionComponent,
  ],
  imports: [
    CommonModule,
    RulesSelectionRoutingModule,
    RegistrationUiModule,
    UserInterfaceModule,
    CoreModule,
    MatSnackBarModule
  ]
})
export class RulesSelectionModule {
}
