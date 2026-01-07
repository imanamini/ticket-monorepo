import { Route } from '@angular/router';
import { FlokiRoutesEnum } from './enums/floki-routes.enum';
import { retryImport } from '../../util/retry-import-handler';
import { BarcodeScannerComponent } from './pages/barcode-scanner/barcode-scanner.component';

export const FLOKI_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => retryImport(() =>
      import('./floki-layout.component'), 3, 500).then(c => c.FlokiLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => retryImport(() =>
          import('../floki/pages/device-value/device-value.component'), 3, 500).then(c => c.DeviceValueComponent),
      },
      {
        path: FlokiRoutesEnum.PLP,
        loadComponent: () => retryImport(() =>
          import('../floki/pages/plp/plp.component'), 3, 500).then(c => c.PlpComponent),
      },
      {
        path: FlokiRoutesEnum.CompleteInfo,
        loadComponent: () => retryImport(() =>
          import('../floki/pages/complete-info/complete-info.component'), 3, 500).then(c => c.CompleteInfoComponent),
      },
      {
        path: FlokiRoutesEnum.IssuedPolicy,
        loadComponent: () => retryImport(() =>
          import('../floki/pages/issued-policy/issued-policy.component'), 3, 500).then(c => c.IssuedPolicyComponent),
      },
      {
        path: FlokiRoutesEnum.UploadImageDevice,
        loadComponent: () => retryImport(() =>
          import('./pages/upload-image-device/upload-image-device.component'), 3, 500).then(c => c.UploadImageDeviceComponent),
      },
      {
        path: FlokiRoutesEnum.ScreenGuide,
        loadComponent: () => retryImport(() =>
          import('./pages/upload-image-device/partial/screen-guide/screen-guide.component'), 3, 500).then(c => c.ScreenGuideComponent),
      },
      {
        path: FlokiRoutesEnum.ExitFloki,
        loadComponent: () => retryImport(() => import('./pages/exit-floki/exit-floki.component'), 3, 500).then(c => c.ExitFlokiComponent),
      },
      {
        path: FlokiRoutesEnum.Payment,
        loadChildren: () => retryImport(() => import('./pages/payment/payment-routes'), 3, 500).then(c => c.PAYMENT_ROUTES),
      },
      {
        path: FlokiRoutesEnum.ShareUploadLink,
        loadComponent: () => retryImport(() =>
          import('./pages/share-upload-link/share-upload-link.component'), 3, 500).then(c => c.ShareUploadLinkComponent),
      },
      {
        path: FlokiRoutesEnum.get_upload_media,
        loadComponent: () => retryImport(() =>
          import('./pages/barcode-scanner/barcode-scanner.component'), 3, 500).then(c => c.BarcodeScannerComponent),
      },
    ]
  }
];
