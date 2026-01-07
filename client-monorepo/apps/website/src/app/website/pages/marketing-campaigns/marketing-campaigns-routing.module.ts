import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MonthlySaleComponent} from "./monthly-sale/monthly-sale.component";

const routes: Routes = [
  {
    path: 'buynow',
    loadComponent: () => import('./metro-140302/metro-140302.component').then((m) => m.Metro140302Component),
  },
  {
    path: 'nobitex',
    loadComponent: () => import('./nobitex/nobitex.component').then((m) => m.NobitexComponent),
  },
  {
    path: 'equipment-insurance',
    loadComponent: () => import('./equipment-insurance/equipment-insurance.component').then((m) => m.EquipmentInsuranceComponent),
  },
  {
    path: 'merchant-register',
    loadComponent: () => import('./merchant-register/merchant-register.component').then((m) => m.MerchantRegisterComponent),
  },
  {
    path: 'offline-payment',
    loadComponent: () => import('./offline-payment/offline-payment.component').then((m) => m.OfflinePaymentComponent),
  },
  {
    path: 'ibim-digipay',
    loadComponent: () => import('./equipment-insurance/equipment-insurance.component').then((m) => m.EquipmentInsuranceComponent),
  },
  {
    path: 'digijet',
    loadComponent: () => import('./digijet/digijet/digijet.component').then((m) => m.DigijetComponent),
  },
  {
    path: 'supermarketdk',
    loadComponent: () => import('./digijet/digijet/digijet.component').then((m) => m.DigijetComponent),
  },
  {
    path: 'monthly-sale',
    loadComponent : () => import('./monthly-sale/monthly-sale.component').then((m) => m.MonthlySaleComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketingCampaignsRoutingModule {}
