import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletManagementRoutingModule } from './wallet-management-routing.module';
import { WalletManagementComponent } from './wallet-management.component';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';
import { NgChartsModule } from 'ng2-charts';
import { WalletManagementGiftCardComponent } from './components/wallet-management-gift-card/wallet-management-gift-card.component';
import { AddGiftCardComponent } from './components/wallet-management-gift-card/add-gift-card/add-gift-card.component';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ExpirationOfGiftCardComponent } from './components/expiration-of-gift-card/expiration-of-gift-card.component';
import { GiftInformationComponent } from './components/wallet-management-gift-card/gift-information/gift-information.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TokenService } from './services/token.service';
import { WalletManagementChartComponent } from './components/wallet-management-chart/wallet-management-chart.component';
import {
  WalletManagementActionButtonComponent
} from './components/wallet-management-action-button/wallet-management-action-button.component';
import { WalletManagementChartLabelComponent } from './components/wallet-management-chart-label/wallet-management-chart-label.component';
import {
  WalletManagementDescriptionStepperComponent
} from './components/wallet-management-description-stepper/wallet-management-description-stepper.component';
import { WalletManagementGiftCardApiService } from '../../api/wallet-management-gift-card-api.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    WalletManagementComponent,
    WalletManagementChartComponent,
    WalletManagementActionButtonComponent,
    WalletManagementChartLabelComponent,
    WalletManagementDescriptionStepperComponent,
    WalletManagementGiftCardComponent,
    AddGiftCardComponent,
    ExpirationOfGiftCardComponent,
    GiftInformationComponent,
  ],
  imports: [
    CommonModule,
    WalletManagementRoutingModule,
    UserInterfaceModule,
    NgChartsModule,
    MatBottomSheetModule,
    MatProgressBarModule,
    MatTooltipModule,
    FormsModule
  ],
  providers: [
    TokenService,
    WalletManagementGiftCardApiService,
    {
    provide: MAT_BOTTOM_SHEET_DATA, useValue: () => {
    }
  },
    {
      provide: MatBottomSheetRef, useValue: () => {
      }
    }]
})
export class WalletManagementModule {
}
