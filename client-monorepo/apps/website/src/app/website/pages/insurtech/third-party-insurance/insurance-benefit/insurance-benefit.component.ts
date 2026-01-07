import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RegisterBenefits} from "../../../../../api/clients/models/templates/c-credit/c-credit-template-data";

@Component({
  selector: 'app-insurance-benefit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insurance-benefit.component.html',
  styleUrl: './insurance-benefit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceBenefitComponent {
  @Input()
  registerBenefitsData: RegisterBenefits;

  constructor() { }

  setActive(benefit:any , status:boolean){
    benefit.isActive = status;
  }
}
