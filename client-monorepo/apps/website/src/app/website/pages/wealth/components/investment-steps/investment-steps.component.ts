import { Component, Input } from '@angular/core';
import { InvestmentSteps } from '../../../../../api/clients/models/templates/wealth/wealth-template-data';
import { NgFor } from '@angular/common';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-investment-steps',
  templateUrl: './investment-steps.component.html',
  styleUrls: ['./investment-steps.component.scss'],
  standalone: true,
  imports: [NgFor, UiIconDirective],
})
export class InvestmentStepsComponent {
  @Input()
  investmentStepsData: InvestmentSteps;
}
