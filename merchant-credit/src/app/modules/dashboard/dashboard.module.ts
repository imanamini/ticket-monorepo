import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';
import { RegistrationUiModule } from '../../sub-modules/registration-ui/registration-ui.module';
import { CoreModule } from '../../core/core.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DashboardComponent } from './dashboard.component';
import { HomePageComponent, WelcomePageComponent } from './pages';
import {
  HomeRequestPriceComponent,
  HomeStatusTabsComponent,
  MerchantCardComponent,
  HomeHelpBottomSheetComponent, SplashScreenComponent
} from './components';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxDividerComponent } from '@digipay/ngx-divider';

@NgModule({
  declarations: [
    WelcomePageComponent,
    HomePageComponent,
    DashboardComponent,
    HomeRequestPriceComponent,
    HomeStatusTabsComponent,
    MerchantCardComponent,
    HomeHelpBottomSheetComponent,
    SplashScreenComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    RegistrationUiModule,
    UserInterfaceModule,
    CoreModule,
    MatSnackBarModule,
    ApiImageModule,
    MatTooltipModule,
    NgxDividerComponent,
  ]
})
export class DashboardModule {
}
