import { Routes } from '@angular/router';
import { ThirdPartyRoutesEnum } from '../../data-access/enums/third-party-routes.enum';
import { ThirdPartyPageTitlesEnum } from '../../../../../../data-access/enums/third-party-page-titles.enum';
import { retryImport } from '../../../../../../util/retry-import-handler';

export const ORDER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => retryImport(() => import('./order.component'), 3, 500).then(m => m.OrderComponent),
    children: [
      {
        path: ThirdPartyRoutesEnum.Checkout,
        data: {title: ThirdPartyPageTitlesEnum.OrderCheckout},
        loadComponent: () => retryImport(() => import('./features/checkout/checkout.component'), 3, 500).then(m => m.CheckoutComponent)
      },
      {
        path: ThirdPartyRoutesEnum.UserInfo,
        data: {title: ThirdPartyPageTitlesEnum.OrderUserInfo},
        loadComponent: () => retryImport(() => import('./features/user-info/user-info.component'), 3, 500).then(m => m.UserInfoComponent)
      },
      {
        path: ThirdPartyRoutesEnum.Address,
        data: {title: ThirdPartyPageTitlesEnum.OrderUserAddress},
        loadComponent: () => retryImport(() => import('./features/user-address/user-address.component'), 3, 500).then(m => m.UserAddressComponent)
      },
      {
        path: ThirdPartyRoutesEnum.UploadDocument,
        data: {title: ThirdPartyPageTitlesEnum.OrderUploadDocument},
        loadComponent: () => retryImport(() => import('./features/upload-document/upload-document.component'), 3, 500).then(m => m.UploadDocumentComponent)
      },
      {
        path: ThirdPartyRoutesEnum.GetPolicyMethod,
        data: {title: ThirdPartyPageTitlesEnum.OrderGetPolicyMethod},
        loadComponent: () => retryImport(() => import('./features/get-policy-method/get-policy-method.component'), 3, 500).then(m => m.GetPolicyMethodComponent)
      },
      {
        path: ThirdPartyRoutesEnum.Complete,
        data: {title: ThirdPartyPageTitlesEnum.OrderCompleteOrder},
        loadComponent: () => retryImport(() => import('./features/complete-order/complete-order.component'), 3, 500).then(m => m.CompleteOrderComponent)
      },
      {
        path: ThirdPartyRoutesEnum.ResolveDocumentsConflict,
        data: {title: ThirdPartyPageTitlesEnum.OrderResolveDocumentsConflict},
        loadComponent: () => retryImport(() => import('./features/resolve-documents-conflict/resolve-documents-conflict.component'), 3, 500).then(m => m.ResolveDocumentsConflictComponent)
      },
      {
        path: ThirdPartyRoutesEnum.State,
        data: {title: ThirdPartyPageTitlesEnum.OrderState},
        loadComponent: () => retryImport(() => import('./features/order-state/order-state.component'), 3, 500).then(m => m.OrderStateComponent)
      },
      {
        path: ThirdPartyRoutesEnum.AdditionalUploadDocument,
        data: {title: ThirdPartyPageTitlesEnum.OrderAdditionalUploadDocument},
        loadComponent: () => retryImport(() => import('./features/additional-upload-document/additional-upload-document.component'), 3, 500).then(m => m.AdditionalUploadDocumentComponent)
      },
      {
        path: ThirdPartyRoutesEnum.VerifyPostalCode,
        data: {title: ThirdPartyPageTitlesEnum.OrderVerifyPostalCode},
        loadComponent: () => retryImport(() => import('./features/verify-postal-code/verify-postal-code.component'), 3, 500).then(m => m.VerifyPostalCodeComponent)
      },
    ]
  },
];
