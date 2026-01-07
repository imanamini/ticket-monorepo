import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditSmartScoringStepRoutingModule } from './credit-smart-scoring-step-routing.module';
import { CreditSmartScoringStepService } from './services/credit-smart-scoring-step.service';

@NgModule({
  imports: [CommonModule, CreditSmartScoringStepRoutingModule],
  providers: [CreditSmartScoringStepService],
})
export class CreditSmartScoringStepModule {}
