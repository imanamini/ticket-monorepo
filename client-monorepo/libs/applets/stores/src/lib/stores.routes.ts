import { Route } from '@angular/router';
import { retryImport } from '@client-monorepo/common/network';
import { canLeaveViolationGuard } from './data-access/guards/can-leave-violation.guard';
import { UsingVoucherGuideComponent } from './features/using-voucher-guide/using-voucher-guide.component';

export const storesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/main/main.component').then((c) => c.MainComponent),
    data: { preload: true },
  },
  {
    path: 'all-categories',
    loadComponent: () => import('./features/all-categories/all-categories.component').then((c) => c.AllCategoriesComponent),
  },
  {
    path: 'promotions/:promotionId',
    loadComponent: () => import('./features/products-list/products-list.component').then((c) => c.ProductsListComponent),
  },
  {
    path: 'products/:title',
    loadComponent: () => import('./features/products-list/products-list.component').then((c) => c.ProductsListComponent),
  },
  {
    path: 'products/uri/:minDiscount/:maxDiscount/:pageTitle',
    loadComponent: () => import('./features/products-list/products-list.component').then((c) => c.ProductsListComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./features/stores-search/stores-search.component').then((c) => c.StoresSearchComponent),
  },
  {
    path: 'shopping-guide',
    loadComponent: () => import('./features/shopping-guide/shopping-guide.component').then((c) => c.ShoppingGuideComponent),
  },
  {
    path: 'onsite-shopping-guide',
    loadComponent: () =>
      import('./features/onsite-shopping-guide-with-details/onsite-shopping-guide-with-details.component').then(
        (c) => c.OnsiteShoppingGuideWithDetailsComponent,
      ),
  },
  {
    path: 'all-stores',
    loadComponent: () => import('./features/all-stores/all-stores.component').then((c) => c.AllStoresComponent),
  },
  {
    path: 'tag/:tag',
    loadComponent: () => import('./features/store-tag/store-tag.component').then((c) => c.StoreTagComponent),
  },
  {
    path: 'map',
    loadComponent: () => import('./features/store-map/store-map.component').then((c) => c.StoreMapComponent),
  },
  {
    path: 'all-vouchers',
    loadComponent: () => import('./features/all-vouchers/all-vouchers.component').then((c) => c.AllVouchersComponent),
  },
  {
    path: 'social/explore',
    loadComponent: () => import('./features/social-explore/social-explore.component').then((c) => c.SocialExploreComponent),
  },
  {
    path: 'social/all-stores',
    loadComponent: () => import('./features/social-all-stores/social-all-stores.component').then((c) => c.SocialAllStoresComponent),
  },
  {
    path: 'social/store/:trackingCode',
    loadComponent: () => import('./features/social-store/social-store.component').then((c) => c.SocialStoreComponent),
  },
  {
    path: 'social/post/:postId',
    loadComponent: () => import('./features/social-post/social-post.component').then((c) => c.SocialPostComponent),
  },
  {
    path: 'social/shopping-guide',
    loadComponent: () =>
      import('./features/social-shopping-guide/social-shopping-guide.component').then((c) => c.SocialShoppingGuideComponent),
  },
  {
    path: 'using-voucher-guide',
    loadComponent: () => import('./features/using-voucher-guide/using-voucher-guide.component').then((c) => c.UsingVoucherGuideComponent),
  },
  {
    path: 'violation',
    loadComponent: () => import('./features/violation-report/violation-report.component').then((c) => c.ViolationReportComponent),
    canDeactivate: [canLeaveViolationGuard],
  },
  {
    path: ':trackingCode',
    loadComponent: () => retryImport(() => import('./features/store/store.component'), 3, 500).then((c) => c.StoreComponent),
  },
  {
    path: ':trackingCode/branches',
    loadComponent: () => import('./features/branches-list/branches-list.component').then((c) => c.BranchesListComponent),
  },
  {
    path: 'external-promotion/okala/:carousel-id',
    loadComponent: () =>
      import('./features/okala-carousel-details/okala-carousel-details.component').then((c) => c.OkalaCarouselDetailsComponent),
  },
];
