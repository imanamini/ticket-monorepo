import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {finalSection} from "../../../../../api/clients/models/templates/bnpl-onboarding/bnpl-onboarding-template-data";

@Component({
  selector: 'app-installment-rules',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './installment-rules.component.html',
  styleUrl: './installment-rules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallmentRulesComponent {
  installmentRules = input<finalSection>();
}
