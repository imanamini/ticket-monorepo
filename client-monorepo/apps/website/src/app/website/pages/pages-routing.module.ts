import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { UserType } from './credit/c-credit-club/models/user-type-model';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'contactus',
    loadComponent: () => import('./contact-us/contact-us.component').then((m) => m.ContactUsComponent),
  },
  {
    path: 'top-up',
    loadComponent: () => import('./top-up/top-up.component').then((m) => m.TopUpComponent),
  },
  {
    path: 'services/bill-payment',
    loadComponent: () => import('./bill/bill.component').then((m) => m.BillComponent),
    data: { prefix: 'services', slug: 'bill-payment' },
  },
  {
    path: 'services/mobile-bill',
    loadComponent: () => import('./bill/bill.component').then((m) => m.BillComponent),
    data: { prefix: 'services', slug: 'mobile-bill' },
  },
  {
    path: 'services/taxi-fare-payment',
    loadComponent: () => import('./bill/bill.component').then((m) => m.BillComponent),
    data: { prefix: 'services', slug: 'taxi-fare-payment' },
  },
  {
    path: 'services/traffic',
    loadChildren: () => import('./simple-page/simple-page-routing.module').then((m) => m.SimplePageRoutingModule),
    data: { prefix: 'services', slug: 'traffic' },
  },
  {
    path: 'services/car-fine',
    loadComponent: () => import('./driving-fine/driving-fine.component').then((m) => m.DrivingFineComponent),
  },
  {
    path: 'services/card-to-card',
    loadComponent: () => import('./card-to-card/card-to-card.component').then((m) => m.CardToCardComponent),
  },
  {
    path: 'internet',
    loadComponent: () => import('./internet/internet.component').then((m) => m.InternetComponent),
  },
  {
    path: 'services', // inner routing
    loadChildren: () => import('./digipay-services/digipay-services-routing.module').then((m) => m.DigipayServicesRoutingModule),
  },
  {
    path: 'faq',
    loadChildren: () => import('./simple-page/simple-page-routing.module').then((m) => m.SimplePageRoutingModule),
    data: { prefix: 'p', slug: 'faq' },
  },
  {
    path: 'partnership/hiweb',
    loadChildren: () => import('./simple-page/simple-page-routing.module').then((m) => m.SimplePageRoutingModule),
    data: { prefix: 'partnership', slug: 'hiweb' },
  },
  {
    path: 'partnership/pars-oil',
    loadChildren: () => import('./simple-page/simple-page-routing.module').then((m) => m.SimplePageRoutingModule),
    data: { prefix: 'partnership', slug: 'pars-oil' },
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./simple-page/simple-page-routing.module').then((m) => m.SimplePageRoutingModule),
    data: { prefix: 'p', slug: 'privacy-policy' },
  },
  {
    path: 'partnership',
    loadChildren: () => import('./simple-page/simple-page-routing.module').then((m) => m.SimplePageRoutingModule),
    data: { prefix: 'p', slug: 'partnership' },
  },
  {
    path: 'rules',
    loadChildren: () => import('./simple-page/simple-page-routing.module').then((m) => m.SimplePageRoutingModule),
    data: { prefix: 'p', slug: 'rules' },
  },
  {
    path: 'partnership/babolsar-transportation',
    loadChildren: () => import('./simple-page/simple-page-routing.module').then((m) => m.SimplePageRoutingModule),
    data: { prefix: 'partnership', slug: 'babolsar-transportation' },
  },
  {
    path: 'about',
    loadComponent: () => import('./about-us/about-us.component').then((m) => m.AboutUsComponent),
  },
  {
    path: 'campaign',
    loadChildren: () => import('./credit/credit-campaign/credit-campaign-routing.module').then((m) => m.CreditCampaignRoutingModule),
  },
  {
    path: 'campaigns',
    loadChildren: () => import('./marketing-campaigns/marketing-campaigns-routing.module').then((m) => m.MarketingCampaignsRoutingModule),
  },
  {
    path: 'credit/cheque/return',
    loadComponent: () => import('./operation/return-cheque/return-cheque.component').then((m) => m.ReturnChequeComponent),
  },
  {
    path: 'credit/mellat-club',
    loadComponent: () => import('./credit/c-credit-club/c-credit-club.component').then((m) => m.CCreditClubComponent),
    data: { prefix: 'credit', slug: 'mellat-club' },
  },
  {
    path: 'credit/tejarat-club',
    loadComponent: () => import('./credit/c-credit-club/c-credit-club.component').then((m) => m.CCreditClubComponent),
    data: { prefix: 'credit', slug: 'tejarat-club' },
  },
  {
    path: 'credit/entekhab',
    loadComponent: () => import('./credit/c-credit-club/c-credit-club.component').then((m) => m.CCreditClubComponent),
    data: {prefix: 'credit', slug: 'entekhab', userType: UserType.ENTEKHAB}
  },
  {
    path: 'credit/safarmarket',
    loadComponent: () => import('./credit/asan-kharid/asan-kharid.component').then((m) => m.AsanKharidComponent),
    data: { prefix: 'credit', slug: 'safarmarket' },
  },
  {
    path: 'credit/card-onboarding',
    loadComponent: () => import('./credit/asan-kharid/asan-kharid.component').then((m) => m.AsanKharidComponent),
    data: { prefix: 'credit', slug: 'card-onboarding' },
  },
  {
    path: 'credit/o-credit',
    loadComponent: () => import('./wallets/wallets.component').then((m) => m.WalletsComponent),
    data: { prefix: 'credit', slug: 'o-credit' },
  },
  {
    path: 'credit/shop-card',
    loadComponent: () => import('./credit/asan-kharid/asan-kharid.component').then((m) => m.AsanKharidComponent),
    data: { prefix: 'credit', slug: 'shop-card' },
  },
  {
    path: 'credit/bmicc',
    loadComponent: () => import('./credit/asan-kharid/asan-kharid.component').then((m) => m.AsanKharidComponent),
    data: { prefix: 'credit', slug: 'bmicc' },
  },
  {
    path: 'credit/zendegi-card',
    loadComponent: () => import('./credit/asan-kharid/asan-kharid.component').then((m) => m.AsanKharidComponent),
    data: { prefix: 'credit', slug: 'zendegi-card' },
  },
  {
    path: 'credit/asankharid',
    loadComponent: () => import('./credit/asan-kharid/asan-kharid.component').then((m) => m.AsanKharidComponent),
    data: { prefix: 'credit', slug: 'asankharid' },
  },
  {
    path: 'bnpl/c-bnpl',
    loadChildren: () => import('./credit/c-bnpl/c-bnpl-routing.module').then((m) => m.CBnplRoutingModule),
  },
  {
    path: 'credit/bnpl2',
    loadComponent: () => import('./credit/bnpl/bnpl.component').then((m) => m.BnplComponent),
    data: { prefix: 'credit', slug: 'bnpl2' },
  },
  {
    path: 'credit/orgbnpl',
    loadComponent: () => import('./credit/o-bnpl/o-bnpl.component').then((m) => m.OBnplComponent),
  },
  {
    path: 'credit/organization',
    loadComponent: () => import('./credit/o-credit/o-credit.component').then((m) => m.OCreditComponent),
  },
  {
    path: 'maincredit',
    pathMatch: 'full',
    loadComponent: () => import('./credit/credit-v3/credit.component').then((m) => m.CreditComponent),
  },
  {
    path: 'credit/c-credit',
    loadChildren: () => import('./credit/c-credit/c-credit-routing.module').then((m) => m.CCreditRoutingModule),
  },
  {
    path: 'partnership/digiexpress',
    loadComponent: () => import('./credit/product-credit/product-credit.component').then((m) => m.ProductCreditComponent),
  },

  {
    path: 'download',
    loadComponent: () => import('./download/download.component').then((m) => m.DownloadComponent),
  },
  {
    path: 'landing/report-2020',
    loadComponent: () => import('./reports/report2020/report2020.component').then((m) => m.Report2020Component),
  },
  {
    path: 'landing/report-2021',
    loadComponent: () => import('./reports/report2021/report2021.component').then((m) => m.Report2021Component),
  },
  {
    path: 'report-1401',
    loadComponent: () => import('./reports/report1401/report1401.component').then((m) => m.Report1401Component),
  },
  {
    path: 'report-1402',
    loadComponent: () => import('./reports/report1402/report1402.component').then((m) => m.Report1402Component),
  },
  {
    path: 'betaapp',
    loadComponent: () => import('./beta-app/beta-app.component').then((m) => m.BetaAppComponent),
  },
  {
    path: 'ipg',
    loadComponent: () => import('./ipg/ipg.component').then((m) => m.IpgComponent),
  },
  {
    path: 'mag', // inner routing
    loadChildren: () => import('./blog/blog.module').then((m) => m.BlogModule),
  },
  {
    path: 'merchant-credit',
    loadComponent: () => import('./credit/merchant-credit/merchant-credit.component').then((m) => m.MerchantCreditComponent),
  },
  {
    path: 'pdy/:icescoring',
    loadComponent: () => import('./pardakhtyar/pardakhtyar.component').then((m) => m.PardakhtyarComponent),
  },
  {
    path: 'pdy',
    loadComponent: () => import('./pardakhtyar/pardakhtyar.component').then((m) => m.PardakhtyarComponent),
  },
  {
    path: 'insurtech',
    loadChildren: () => import('./insurtech/insurtech-routing.module').then((m) => m.InsurtechRoutingModule),
  },

  {
    path: 'sub',
    loadComponent: () => import('./subscription/subscription.component').then((m) => m.SubscriptionComponent),
  },
  {
    path: 'landing',
    loadChildren: () => import('./simple-page/simple-page-routing.module').then((m) => m.SimplePageRoutingModule),
  },
  {
    path: 'credit-fund',
    loadComponent: () => import('./credit/bnpl/bnpl.component').then((m) => m.BnplComponent),
    data: { prefix: 'p', slug: 'credit-fund' },
  },
  {
    path: 'warranty',
    loadComponent: () => import('./warranty/warranty.component').then((m) => m.WarrantyComponent),
  },
  {
    path: 'branches',
    loadComponent: () => import('./branches-address/branches-address.component').then((m) => m.BranchesAddressComponent),
  },
  {
    path: 'bpg',
    loadComponent: () => import('./bpg/bpg.component').then((m) => m.BpgComponent),
  },
  {
    path: 'o-wallet',
    loadComponent: () => import('./wallets/wallets.component').then((m) => m.WalletsComponent),
    data: { prefix: 'p', slug: 'o-wallet' },
  },
  {
    path: 'tetherland',
    loadComponent: () => import('./credit/asan-kharid/asan-kharid.component').then((m) => m.AsanKharidComponent),
    data: { prefix: 'p', slug: 'tetherland' },
  },
  {
    path: 'c-wallet',
    loadComponent: () => import('./wallets/wallets.component').then((m) => m.WalletsComponent),
    data: { prefix: 'p', slug: 'c-wallet' },
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support-routing.module').then((m) => m.SupportRoutingModule),
  },
  {
    path: 'careers',
    loadChildren: () => import('./careers/careers-routing.module').then((m) => m.CareersRoutingModule),
  },
  {
    path: 'working-capital',
    loadComponent: () => import('./credit/working-capital/working-capital.component').then((m) => m.WorkingCapitalComponent),
  },
  {
    path: 'merchants-seller',
    loadComponent: () => import('./credit/merchants-seller/merchants-seller.component').then((m) => m.MerchantsSellerComponent),
  },
  {
    path: 'wealth',
    loadComponent: () => import('./wealth/wealth.component').then((m) => m.WealthComponent),
  },
  {
    path: 'nearby-stores/map',
    loadComponent: () => import('libs/applets/stores/src/lib/features/store-map/store-map.component').then((c) => c.StoreMapComponent),
  },
  {
    path: 'working-capital/kyb',
    loadComponent: () => import('./credit/working-capital-kyb/working-capital-kyb.component').then((m) => m.WorkingCapitalKybComponent),
  },
  {
    path: 'credit/merchants',
    loadChildren: () => import('./merchants/merchants-routing.module').then((m) => m.MerchantsRoutingModule),
  },
  {
    path: 'credit/:slug',
    loadComponent: () => import('./credit/product-credit/product-credit.component').then((m) => m.ProductCreditComponent),
  },
  // static landings
  {
    path: 'landings',
    loadChildren: () => import('./static-landings/static-landings-routing.module').then((m) => m.StaticLandingsRoutingModule),
  },

  {
    path: '**',
    pathMatch: 'full',
    loadComponent: () => import('./not-found/not-found-page.component').then((m) => m.NotFoundPageComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class PagesRoutingModule {}
