import { Component, Input } from '@angular/core';
import { RegisterBenefits } from '../../../../api/clients/models/templates/c-credit/c-credit-template-data';
import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-credit-register-benefits',
  templateUrl: './credit-register-benefits.component.html',
  styleUrls: ['./credit-register-benefits.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, NgOptimizedImage],
})
export class CreditRegisterBenefitsComponent {
  @Input()
  registerBenefitsData: RegisterBenefits;
}
