import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { ContentCardComponent } from './content-card/content-card.component';
import { RuleCardComponent } from './rule-card/rule-card.component';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { FlowHeaderComponent } from './flow-header/flow-header.component';
import { FlowStepComponent } from './flow-step/flow-step.component';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';
import { ChecklistItemComponent } from './checklist-item/checklist-item.component';
import { AmountBoxComponent } from './amount-box/amount-box.component';
import { CostDetailsComponent } from './cost-details/cost-details.component';
import { ProgressiveFlowComponent } from './progressive-flow/progressive-flow.component';
import { ProgressStepDirective } from './progressive-flow/progress-step.directive';
import { FormSectionComponent } from './form-section/form-section.component';
import { DocumentPickerComponent } from './document-picker/document-picker.component';
import { StepFooterComponent } from './step-footer/step-footer.component';
import { ProgressContentDirective } from './progressive-flow/progress-content.directive';


@NgModule({
  declarations: [
    PageLayoutComponent,
    ContentCardComponent,
    RuleCardComponent,
    FlowHeaderComponent,
    FlowStepComponent,
    ChecklistItemComponent,
    AmountBoxComponent,
    CostDetailsComponent,
    ProgressiveFlowComponent,
    ProgressStepDirective,
    ProgressContentDirective,
    FormSectionComponent,
    DocumentPickerComponent,
    StepFooterComponent,
  ],
  exports: [
    PageLayoutComponent,
    ContentCardComponent,
    RuleCardComponent,
    FlowHeaderComponent,
    FlowStepComponent,
    ChecklistItemComponent,
    AmountBoxComponent,
    CostDetailsComponent,
    ProgressiveFlowComponent,
    ProgressStepDirective,
    ProgressContentDirective,
    FormSectionComponent,
    DocumentPickerComponent,
    StepFooterComponent,
  ],
  imports: [
    CommonModule,
    ApiImageModule,
    UserInterfaceModule
  ]
})
export class RegistrationUiModule { }
