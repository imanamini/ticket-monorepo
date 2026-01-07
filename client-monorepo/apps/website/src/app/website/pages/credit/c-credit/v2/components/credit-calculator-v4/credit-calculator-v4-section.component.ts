import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CreditCalculatorV4Component
} from '../../../../../../../ui/ui-components/ui-credit/credit-calculator-v4/credit-calculator-v4.component';

@Component({
  selector: 'app-credit-calculator-section',
  standalone: true,
  imports: [CommonModule, CreditCalculatorV4Component],
  templateUrl: './credit-calculator-v4-section.component.html',
  styleUrl: './credit-calculator-v4-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCalculatorV4SectionComponent {

}
