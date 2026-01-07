import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./credit-generate-digital-signature-wrapper/credit-generate-digital-signature-wrapper.component').then(
        (component) => component.CreditGenerateDigitalSignatureWrapperComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./credit-generate-digital-signature-step/credit-generate-digital-signature-step.component').then(
            (component) => component.CreditGenerateDigitalSignatureStepComponent,
          ),
      },
      {
        path: 'info-form',
        loadComponent: () =>
          import('./credit-generate-digital-signature-info-form/credit-generate-digital-signature-info-form.component').then(
            (component) => component.CreditGenerateDigitalSignatureInfoFormComponent,
          ),
      },
      {
        path: 'take-photo',
        loadComponent: () =>
          import(
            './credit-generate-digital-signature-image-capture-face-step/credit-generate-digital-signature-image-capture-face-step.component'
          ).then((component) => component.CreditGenerateDigitalSignatureImageCaptureFaceStepComponent),
      },
      {
        path: 'take-video',
        loadComponent: () =>
          import(
            './credit-generate-digital-signature-image-capture-face-step/credit-generate-digital-signature-image-capture-face-step.component'
          ).then((component) => component.CreditGenerateDigitalSignatureImageCaptureFaceStepComponent),
      },
      {
        path: 'generate-signature',
        loadComponent: () =>
          import('./credit-generate-digital-signature-wet-sign/credit-generate-digital-signature-wet-sign.component').then(
            (component) => component.CreditGenerateDigitalSignatureWetSignComponent,
          ),
      },
      {
        path: 'generate-signature-password',
        loadComponent: () =>
          import('./credit-generate-digital-signature-password/credit-generate-digital-signature-password.component').then(
            (component) => component.CreditGenerateDigitalSignaturePasswordComponent,
          ),
      },
      {
        path: 'token-expired',
        loadComponent: () =>
          import('./credit-generate-digital-signature-token-expired/credit-generate-digital-signature-token-expired.component').then(
            (component) => component.CreditGenerateDigitalSignatureTokenExpiredComponent,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditGenerateDigitalSignatureRoutingModule {}
