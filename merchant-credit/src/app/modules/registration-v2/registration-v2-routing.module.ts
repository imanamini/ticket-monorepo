import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationManagerComponent } from './pages/registration-manager/registration-manager.component';
import {
  RegistrationOverviewPageComponent
} from './pages/registration-overview-page/registration-overview-page.component';
import { StepDocumentsComponent } from './pages/steps/step-documents/step-documents.component';
import { StepCreditScoreComponent } from './pages/steps/step-credit-score/step-credit-score.component';
import { StepRegistrationFeeComponent } from './pages/steps/step-registration-fee/step-registration-fee.component';
import { StepIdentificationComponent } from './pages/steps/step-identification/step-identification.component';
import { StepFinishedComponent } from './pages/steps/step-finished/step-finished.component';
import { FeePaymentCallbackComponent } from './pages/fee-payment-callback/fee-payment-callback.component';
import { StepOpenBankAccountComponent } from './pages/steps/step-open-bank-account/step-open-bank-account.component';
import { StepSignatureComponent } from './pages/steps/step-signature/step-signature.component';
import {
  SignatureCallbackComponent
} from './pages/steps/step-signature/signature-callback/signature-callback.component';
import {RegistrationPathFinderComponent} from './pages/registration-path-finder/registration-path-finder.component';

const routes: Routes = [
  {
    path: 'callback/fee/:creditId',
    component: FeePaymentCallbackComponent,
  },
  {
    path: ':creditId',
    component: RegistrationManagerComponent,
    children: [
      {
        path: '',
        component: RegistrationPathFinderComponent,
      },
      {
        path: 'overview',
        component: RegistrationOverviewPageComponent,
      },
      {
        path: 'step',
        children: [
          {
            path: 'documents',
            component: StepDocumentsComponent,
          },
          {
            path: 'score',
            component: StepCreditScoreComponent,
          },
          {
            path: 'fee',
            component: StepRegistrationFeeComponent,
          },
          {
            path: 'identification',
            component: StepIdentificationComponent,
          },
          {
            path: 'bank-account',
            component: StepOpenBankAccountComponent,
          },
          {
            path: 'signature',
            component: StepSignatureComponent,
          },
          {
            path: 'signature/callback',
            component: SignatureCallbackComponent,
          },
          {
            path: 'sign',
            loadChildren: () => import('./pages/steps/step-sign-documents/step-sign-documents.module').then(m => m.StepSignDocumentsModule),
          },
          {
            path: 'finished',
            component: StepFinishedComponent,
          },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationV2RoutingModule {
}
