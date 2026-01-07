import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  UiComplexAccordionComponent
} from "../../../../ui/ui-components/ui-complex-accordion/ui-complex-accordion/ui-complex-accordion.component";

import {Registering} from "../../../../api/clients/models/templates/c-credit/c-credit-template-data";

@Component({
  selector: 'app-loan-guide',
  standalone: true,
  imports: [CommonModule, UiComplexAccordionComponent],
  templateUrl: './loanGuide.component.html',
  styleUrl: './loanGuide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanGuideComponent {
  registering = input<Registering>();
}
