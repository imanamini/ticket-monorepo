import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IplLayoutComponent } from './ipl-layout/ipl-layout.component';
import { IplStepsComponent } from './ipl-steps/ipl-steps.component';
import { IplDetailComponent } from './ipl-steps/ipl-detail/ipl-detail.component';
import { IplCellNumberComponent } from './ipl-steps/ipl-cell-number/ipl-cell-number.component';
import { IplOtpCodeComponent } from './ipl-steps/ipl-otp-code/ipl-otp-code.component';
import { IplPinCodeComponent } from './ipl-steps/ipl-pin-code/ipl-pin-code.component';
import { DpgPayComponent } from './ipl-dgp-pay/dpg-pay.component';

const routes: Routes = [
  {
    path: ':uuid',
    component: IplLayoutComponent,
    children: [
      {
        path: '',
        component: IplStepsComponent,
        children: [
          {
            path: '',
            component: IplDetailComponent,
          },
          {
            path: 'cell-number',
            component: IplCellNumberComponent
          },
          {
            path: 'otp-code',
            component: IplOtpCodeComponent
          },
          {
            path: 'pin-code',
            component: IplPinCodeComponent
          },
        ],
      },
      {
        path: 'dpg/pay',
        component: DpgPayComponent,
      },
      {
        path: 'error',
        loadComponent: () => import('./ipl-errors/ipl-errors.component').then(m => m.IplErrorsComponent)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IplRoutingModule {

}
