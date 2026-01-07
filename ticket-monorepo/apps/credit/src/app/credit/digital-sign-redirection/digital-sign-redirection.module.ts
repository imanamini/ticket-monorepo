import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalSignRedirectionComponent } from './digital-sign-redirection/digital-sign-redirection.component';
import { DigitalSignRedirectionRoutingModule } from './digital-sign-redirection-routing.module';
import { CreditUiModule } from '../credit-ui/credit-ui.module';
import { SharedModule } from '../shared';

@NgModule({
  declarations: [
    DigitalSignRedirectionComponent
  ],
  imports: [
    CommonModule,
    DigitalSignRedirectionRoutingModule,
    CreditUiModule,
    SharedModule
  ]
})
export class DigitalSignRedirectionModule {
}
