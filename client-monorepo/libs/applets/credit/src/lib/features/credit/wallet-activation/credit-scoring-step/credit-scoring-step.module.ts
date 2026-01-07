import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditScoringStepService } from './services/credit-scoring-step.service';
import { CreditScoringStepRoutingModule } from './credit-scoring-step-routing.module';

@NgModule({
  imports: [CommonModule, CreditScoringStepRoutingModule],
  providers: [CreditScoringStepService],
})
export class CreditScoringStepModule {}
