import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BnplLandingComponent } from './bnpl-landing/bnpl-landing.component';
import { BnplActivationComponent } from './bnpl-activation/bnpl-activation.component';
import { BnplRoutingModule } from './bnpl-routing.module';
import { CreditUiModule } from '../../credit-ui/credit-ui.module';
import { BnplTitleBarComponent } from './ui-components/bnpl-title-bar/bnpl-title-bar.component';
import { BnplLayoutComponent } from './bnpl-layout/bnpl-layout.component';
import {
  BnplLandingGuideSectionComponent
} from './bnpl-landing/bnpl-landing-guide-section/bnpl-landing-guide-section.component';
import {
  BnplLandingQAndASectionComponent
} from './bnpl-landing/bnpl-landing-q-and-a-section/bnpl-landing-q-and-a-section.component';
import { BnplLandingFooterComponent } from './bnpl-landing/bnpl-landing-footer/bnpl-landing-footer.component';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared';
import { CardLayoutComponent } from './ui-components/card-layout/card-layout.component';
import { FormFieldBuilderModule } from '../../shared/form-field-builder/form-field-builder.module';
import { BnplErrorHandlingService } from './services/bnpl-error-handling.service';
import { BnplErrorPageComponent } from './bnpl-error-page/bnpl-error-page.component';
import { BnplFailedScoringPageComponent } from './bnpl-failed-scoring-page/bnpl-failed-scoring-page.component';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { BnplLandingHeaderComponent } from './bnpl-landing/bnpl-landing-header/bnpl-landing-header.component';
import { BnplLandingIntroComponent } from './bnpl-landing/bnpl-landing-intro/bnpl-landing-intro.component';
import { BnplLandingSupportComponent } from './bnpl-landing/bnpl-landing-support/bnpl-landing-support.component';
import { UiIconModule } from '../../shared/components/ui-icon/ui-icon.module';
import { CreditRouteStateService } from '../../core/services/route-state/credit-route-state.service';
import { CountdownComponent } from 'ngx-countdown';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxButtonComponent } from '@digipay/ngx-button';

@NgModule({
  declarations: [
    BnplLandingComponent,
    BnplActivationComponent,
    BnplTitleBarComponent,
    BnplLayoutComponent,
    BnplLandingGuideSectionComponent,
    BnplLandingQAndASectionComponent,
    BnplLandingFooterComponent,
    BnplErrorPageComponent,
    BnplFailedScoringPageComponent,
  ],
  imports: [
    CommonModule,
    BnplRoutingModule,
    CreditUiModule,
    MatIconModule,
    SharedModule,
    FormFieldBuilderModule,
    CardLayoutComponent,
    NgxStatusResultModule,
    BnplLandingHeaderComponent,
    BnplLandingIntroComponent,
    BnplLandingSupportComponent,
    UiIconModule,
    CountdownComponent,
    UiFormFieldBuilderModule,
    NgxButtonComponent,
  ],
  providers: [
    BnplErrorHandlingService,
    {
      provide: 'RouteStateInterface',
      useClass: CreditRouteStateService,
    }
  ]
})
export class BnplModule {
}
